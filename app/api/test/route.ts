import { NextResponse } from "next/server";
import mongoose from "mongoose";
import {
  connectDB,
  logMongoConnectionError,
  validateMongoUri,
} from "@/lib/mongodb";
import { initializeDatabase } from "@/lib/db/init";

export async function GET() {
  try {
    const uri = process.env.MONGODB_URI;
    if (uri) {
      const validation = validateMongoUri(uri);
      console.log("[api/test] MONGODB_URI:", validation.maskedUri);
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: validation.errors.join("; ") },
          { status: 500 }
        );
      }
    }

    await connectDB();
    await initializeDatabase();

    const db = mongoose.connection.db;
    const counts: Record<string, number> = {};
    if (db) {
      const collections = await db.listCollections().toArray();
      for (const col of collections) {
        counts[col.name] = await db.collection(col.name).countDocuments();
      }
    }

    return NextResponse.json({
      success: true,
      message: "MongoDB Connected Successfully",
      database: mongoose.connection.name,
      collections: counts,
    });
  } catch (error) {    logMongoConnectionError(error);
    const message =
      error instanceof Error ? error.message : "Failed to connect to MongoDB";

    return NextResponse.json(
      {
        success: false,
        error: message,
        hint: getConnectionHint(error),
      },
      { status: 500 }
    );
  }
}

function getConnectionHint(error: unknown): string | undefined {
  if (!(error instanceof Error)) return undefined;
  if (error.message.includes("querySrv ECONNREFUSED")) {
    return "DNS SRV lookup refused by local resolver. lib/mongodb.ts sets public DNS; restart dev server.";
  }
  if (error.message.includes("unable to verify the first certificate")) {
    return "TLS CA issue on Node.js 24 Windows. Use: npm run dev (includes --use-system-ca).";
  }
  if (error.message.includes("whitelist")) {
    return "Add your IP to MongoDB Atlas → Network Access.";
  }
  return undefined;
}
