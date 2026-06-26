import { NextResponse } from "next/server";

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function handleAuthError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") {
      return jsonError("Unauthorized", 401);
    }
    if (error.message === "FORBIDDEN") {
      return jsonError("Forbidden", 403);
    }
  }
  return jsonError("Internal server error", 500);
}
