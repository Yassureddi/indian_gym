import type { RequestHandler } from "express";

type AsyncHandler = (
  req: Parameters<RequestHandler>[0],
  res: Parameters<RequestHandler>[1],
  next: Parameters<RequestHandler>[2]
) => Promise<void>;

export const asyncHandler =
  (fn: AsyncHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
