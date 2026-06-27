import { NextResponse } from "next/server";

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function isMongoError(error: Error): boolean {
  const name = error.name;
  return (
    name === "MongoServerError" ||
    name === "MongooseServerSelectionError" ||
    name === "MongoNetworkError" ||
    name === "MongoTimeoutError" ||
    error.message.includes("MONGODB_URI") ||
    error.message.includes("MongoDB") ||
    error.message.includes("ECONNREFUSED") ||
    error.message.includes("whitelist")
  );
}

export function handleAuthError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") {
      return jsonError("Unauthorized", 401);
    }
    if (error.message === "FORBIDDEN") {
      return jsonError("Forbidden", 403);
    }

    console.error("[api] Error:", error.name, error.message);

    if (error.message.includes("Missing MONGODB_URI")) {
      return jsonError("Database not configured. Set MONGODB_URI in deployment settings.", 503);
    }

    if (isMongoError(error)) {
      return jsonError(
        "Database connection failed. Check MONGODB_URI and Atlas Network Access (allow 0.0.0.0/0).",
        503
      );
    }
  } else {
    console.error("[api] Unknown error:", error);
  }

  return jsonError("Internal server error", 500);
}
