import type { Response } from "express";
import type { FilterQuery } from "mongoose";
import { Gallery, type IGalleryDocument } from "../models/Gallery.model.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination, paginatedResponse } from "../utils/pagination.js";
import { NotFoundError } from "../utils/ApiError.js";

export const listGallery = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter: FilterQuery<IGalleryDocument> = { isPublished: true };
  if (req.query.category) filter.category = req.query.category;

  const [items, total] = await Promise.all([
    Gallery.find(filter).sort({ sortOrder: 1, createdAt: -1 }).skip(skip).limit(limit),
    Gallery.countDocuments(filter),
  ]);

  res.json(paginatedResponse(items, total, page, limit));
});

export const listGalleryAdmin = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter: FilterQuery<IGalleryDocument> = {};
  if (req.query.category) filter.category = req.query.category;

  const [items, total] = await Promise.all([
    Gallery.find(filter).sort({ sortOrder: 1, createdAt: -1 }).skip(skip).limit(limit),
    Gallery.countDocuments(filter),
  ]);

  res.json(paginatedResponse(items, total, page, limit));
});

export const getGalleryItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const item = await Gallery.findById(req.params.id);
  if (!item) {
    throw new NotFoundError("Gallery item not found");
  }
  res.json({ success: true, data: item });
});

export const createGalleryItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const item = await Gallery.create(req.body);
  res.status(201).json({
    success: true,
    message: "Gallery item created",
    data: item,
  });
});

export const updateGalleryItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    throw new NotFoundError("Gallery item not found");
  }
  res.json({
    success: true,
    message: "Gallery item updated",
    data: item,
  });
});

export const deleteGalleryItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const item = await Gallery.findByIdAndDelete(req.params.id);
  if (!item) {
    throw new NotFoundError("Gallery item not found");
  }
  res.json({ success: true, message: "Gallery item deleted" });
});
