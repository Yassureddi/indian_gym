import mongoose from "mongoose";
import { applyMongoDnsServers, resolveAtlasSrvRecords } from "@/lib/mongodb-dns";

/**
 * Cached connection state for Next.js App Router.
 * Reuses the same Mongoose instance across hot reloads in development.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

let resolvedUriCache: string | null = null;

/** Mask password in connection string for safe logging */
export function maskMongoUri(uri: string): string {
  return uri.replace(/:([^:@/]+)@/, ":********@");
}

function logDebug(message: string) {
  if (process.env.MONGODB_DEBUG === "1" || process.env.NODE_ENV === "development") {
    console.log(`[mongodb] ${message}`);
  }
}

/**
 * Windows + Node.js often use a local DNS resolver that refuses Node SRV queries.
 * applyMongoDnsServers() sets public resolvers; mongodb-dns.ts adds DoH fallback.
 */
export function configureMongoDns(): void {
  const servers = applyMongoDnsServers();
  logDebug(`DNS servers set: ${servers.join(", ")}`);
}

export interface MongoUriValidation {
  valid: boolean;
  errors: string[];
  maskedUri: string;
  databaseName: string | null;
  isSrv: boolean;
}

/** Validate MONGODB_URI before attempting connection */
export function validateMongoUri(uri: string): MongoUriValidation {
  const errors: string[] = [];
  let databaseName: string | null = null;
  let isSrv = false;

  try {
    const parsed = new URL(uri);
    isSrv = parsed.protocol === "mongodb+srv:";
    if (!isSrv && parsed.protocol !== "mongodb:") {
      errors.push(`Invalid protocol "${parsed.protocol}". Use mongodb+srv: or mongodb:`);
    }
    databaseName = parsed.pathname.replace(/^\//, "") || null;
    if (!databaseName) {
      errors.push("Database name is missing in the URI path (e.g. /indian_zym_db)");
    }
    if (!parsed.hostname) {
      errors.push("Hostname is missing in MONGODB_URI");
    }
  } catch {
    errors.push("MONGODB_URI is not a valid URL");
  }

  return {
    valid: errors.length === 0,
    errors,
    maskedUri: maskMongoUri(uri),
    databaseName,
    isSrv,
  };
}

function getMongoUri(): string {
  logDebug("Loading environment...");
  logDebug("Reading MONGODB_URI...");

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "Missing MONGODB_URI. Add it to .env.local (e.g. mongodb+srv://user:pass@cluster0.znjyfml.mongodb.net/indian_zym_db?retryWrites=true&w=majority&appName=Cluster0)"
    );
  }

  const validation = validateMongoUri(uri);
  logDebug(`URI: ${validation.maskedUri}`);

  if (!validation.valid) {
    throw new Error(`Invalid MONGODB_URI: ${validation.errors.join("; ")}`);
  }

  logDebug(`Database: ${validation.databaseName}`);
  logDebug(`SRV URI: ${validation.isSrv ? "yes" : "no"}`);

  return uri;
}

/**
 * Convert mongodb+srv → mongodb:// using our DNS resolver.
 * The MongoDB driver runs its own SRV lookup which ignores dns.setServers()
 * inside Next.js/webpack on Windows — causing querySrv ECONNREFUSED.
 */
async function resolveMongoUri(uri: string): Promise<string> {
  if (resolvedUriCache) return resolvedUriCache;

  // Optional: skip SRV entirely with a pre-resolved standard URI
  const standardOverride = process.env.MONGODB_URI_STANDARD?.trim();
  if (standardOverride) {
    logDebug("Using MONGODB_URI_STANDARD (SRV resolution skipped)");
    resolvedUriCache = standardOverride;
    return standardOverride;
  }

  const parsed = new URL(uri);
  if (parsed.protocol !== "mongodb+srv:") {
    resolvedUriCache = uri;
    return uri;
  }

  // Vercel/Linux: native driver SRV resolution works — custom DNS is Windows-only.
  const useNativeSrv =
    process.platform !== "win32" && process.env.FORCE_MONGO_SRV_RESOLVE !== "1";
  if (useNativeSrv) {
    logDebug("Using mongodb+srv URI directly (serverless/Linux)");
    resolvedUriCache = uri;
    return uri;
  }

  configureMongoDns();

  const srvName = `_mongodb._tcp.${parsed.hostname}`;
  logDebug(`Resolving SRV: ${srvName}`);

  const { srv: srvRecords, txt: txtRecords } = await resolveAtlasSrvRecords(
    parsed.hostname,
    logDebug
  );

  if (!srvRecords.length) {
    throw new Error(`No SRV records found for ${srvName}`);
  }

  const hosts = srvRecords.map((r) => `${r.name}:${r.port}`).join(",");
  const user = decodeURIComponent(parsed.username);
  const pass = decodeURIComponent(parsed.password);
  const userinfo = user
    ? `${encodeURIComponent(user)}:${encodeURIComponent(pass)}@`
    : "";

  const params = new URLSearchParams(parsed.searchParams);
  params.set("ssl", "true");

  for (const txt of txtRecords) {
    const txtParams = new URLSearchParams(txt);
    txtParams.forEach((value, key) => {
      if (!params.has(key)) params.set(key, value);
    });
  }

  if (!params.has("authSource")) {
    params.set("authSource", "admin");
  }

  const pathname = parsed.pathname || "/";
  const standardUri = `mongodb://${userinfo}${hosts}${pathname}?${params.toString()}`;

  logDebug(`Resolved to standard URI: ${maskMongoUri(standardUri)}`);
  resolvedUriCache = standardUri;
  return standardUri;
}

/** Print full error details for connection failures */
export function logMongoConnectionError(error: unknown): void {
  console.error("[mongodb] Connection failed.");

  if (error instanceof Error) {
    console.error("[mongodb] Error name:", error.name);
    console.error("[mongodb] Error message:", error.message);
    const withCode = error as Error & { code?: string | number; cause?: unknown; reason?: unknown };
    if (withCode.code !== undefined) console.error("[mongodb] Error code:", withCode.code);
    if (withCode.cause) console.error("[mongodb] Error cause:", withCode.cause);
    if (withCode.reason) console.error("[mongodb] Error reason:", withCode.reason);
    if (error.stack) console.error("[mongodb] Stack trace:\n", error.stack);

    if (error.message.includes("querySrv ECONNREFUSED")) {
      console.error("[mongodb] DNS lookup failed (SRV). Local DNS may refuse Node.js queries on Windows.");
    }
    if (error.message.includes("unable to verify the first certificate")) {
      console.error(
        "[mongodb] TLS verification failed. On Node.js 24+ Windows, run with: node --use-system-ca"
      );
    }
    if (error.message.includes("whitelist") || error.message.includes("IP")) {
      console.error("[mongodb] Atlas may be blocking this IP. Add 0.0.0.0/0 or your IP in Network Access.");
    }
  } else {
    console.error("[mongodb] Unknown error:", error);
  }
}

/**
 * Connect to MongoDB Atlas using Mongoose.
 * Safe to call from every API route — connection is cached globally.
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn && mongoose.connection.readyState === 1) {
    logDebug("Using cached connection.");
    return cached.conn;
  }

  if (cached.conn && mongoose.connection.readyState !== 1) {
    logDebug("Stale connection detected, reconnecting...");
    cached.conn = null;
    cached.promise = null;
  }

  configureMongoDns();

  if (!cached.promise) {
    const uri = getMongoUri();
    logDebug("Connecting to MongoDB...");

    cached.promise = (async () => {
      const connectionUri = await resolveMongoUri(uri);
      return mongoose.connect(connectionUri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 15000,
      });
    })();
  }

  try {
    cached.conn = await cached.promise;
    logDebug("Connected.");
  } catch (error) {
    cached.promise = null;
    logMongoConnectionError(error);
    throw error;
  }

  return cached.conn;
}

/**
 * Run DNS SRV diagnostic (used by scripts/test-db.ts).
 */
export async function diagnoseMongoDns(hostname: string) {
  configureMongoDns();
  const { srv } = await resolveAtlasSrvRecords(hostname);
  return srv.map((r) => ({
    name: r.name,
    port: r.port,
    priority: r.priority,
    weight: r.weight,
  }));
}
