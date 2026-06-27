/**
 * Standalone MongoDB Atlas connection diagnostic.
 * Run: npm run test:db
 *
 * Requires Node --use-system-ca on Windows + Node.js 24 for TLS (see package.json script).
 */
import dns from "dns";
import net from "net";
import mongoose from "mongoose";
import {
  configureMongoDns,
  diagnoseMongoDns,
  logMongoConnectionError,
  maskMongoUri,
  validateMongoUri,
} from "../lib/mongodb";

const SRV_HOST = "_mongodb._tcp.cluster0.znjyfml.mongodb.net";

function loadEnvLocal() {
  try {
    const { readFileSync, existsSync } = require("fs") as typeof import("fs");
    const { resolve } = require("path") as typeof import("path");
    const envPath = resolve(process.cwd(), ".env.local");
    if (!existsSync(envPath)) {
      console.log("⚠️  .env.local not found");
      return;
    }
    const content = readFileSync(envPath, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
    console.log("✅ Loaded .env.local");
  } catch (err) {
    console.error("❌ Failed to load .env.local:", err);
  }
}

function tcpProbe(host: string, port: number, timeoutMs = 8000): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.createConnection(port, host);
    const timer = setTimeout(() => {
      socket.destroy();
      resolve(false);
    }, timeoutMs);
    socket.on("connect", () => {
      clearTimeout(timer);
      socket.destroy();
      resolve(true);
    });
    socket.on("error", () => {
      clearTimeout(timer);
      resolve(false);
    });
  });
}

async function main() {
  console.log("=== MongoDB Atlas Diagnostic ===\n");
  console.log(`Node.js: ${process.version}`);
  console.log(`Platform: ${process.platform} ${process.arch}`);
  console.log(`NODE_OPTIONS: ${process.env.NODE_OPTIONS ?? "(none)"}\n`);

  loadEnvLocal();

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ MONGODB_URI is not set");
    process.exit(1);
  }

  console.log(`MONGODB_URI: ${maskMongoUri(uri)}`);
  const validation = validateMongoUri(uri);
  if (!validation.valid) {
    console.error("❌ URI validation failed:", validation.errors.join("; "));
    process.exit(1);
  }
  console.log(`✅ URI valid — database: ${validation.databaseName}\n`);

  // DNS: default Node resolver
  console.log("--- DNS (default Node resolver) ---");
  try {
    await dns.promises.resolveSrv(SRV_HOST);
    console.log("✅ SRV lookup OK (default DNS)");
  } catch (err) {
    const e = err as NodeJS.ErrnoException;
    console.log(`❌ SRV lookup failed (default DNS): ${e.code} ${e.message}`);
  }

  // DNS: configured public resolvers
  console.log("\n--- DNS (configured resolvers) ---");
  try {
    const records = await diagnoseMongoDns(SRV_HOST);
    console.log(`✅ SRV lookup OK — ${records.length} host(s):`);
    for (const r of records) {
      console.log(`   ${r.name}:${r.port}`);
    }

    console.log("\n--- TCP connectivity (port 27017) ---");
    for (const r of records) {
      const ok = await tcpProbe(r.name, r.port);
      console.log(ok ? `✅ TCP OK ${r.name}` : `❌ TCP FAIL ${r.name}`);
    }
  } catch (err) {
    const e = err as NodeJS.ErrnoException;
    console.log(`❌ SRV lookup failed: ${e.code} ${e.message}`);
  }

  // Mongoose connect (via shared connectDB — resolves SRV before driver)
  console.log("\n--- Mongoose connection ---");

  try {
    const { connectDB } = await import("../lib/mongodb");
    await connectDB();
    console.log("\n✅ MongoDB Connected");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Complete connection error:");
    logMongoConnectionError(error);
    process.exit(1);
  }
}

main();
