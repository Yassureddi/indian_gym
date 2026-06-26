import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.message,
    });
  }

  if ((err as { code?: number }).code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate field value",
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: env.isProduction ? "Internal server error" : err.message,
  });
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ success: false, message: "API route not found" });
}
