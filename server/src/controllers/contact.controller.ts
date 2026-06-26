import type { Response } from "express";
import type { FilterQuery } from "mongoose";
import { Contact, type IContactDocument } from "../models/Contact.model.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination, paginatedResponse } from "../utils/pagination.js";
import { NotFoundError } from "../utils/ApiError.js";

export const submitContact = asyncHandler(async (req: AuthRequest, res: Response) => {
  const contact = await Contact.create(req.body);

  res.status(201).json({
    success: true,
    message: "Message received. We will contact you soon.",
    data: { id: contact._id },
  });
});

export const listContacts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter: FilterQuery<IContactDocument> = {};

  if (req.query.status) filter.status = req.query.status;

  const [contacts, total] = await Promise.all([
    Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Contact.countDocuments(filter),
  ]);

  res.json(paginatedResponse(contacts, total, page, limit));
});

export const getContact = asyncHandler(async (req: AuthRequest, res: Response) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    throw new NotFoundError("Contact message not found");
  }
  res.json({ success: true, data: contact });
});

export const updateContactStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!contact) {
    throw new NotFoundError("Contact message not found");
  }
  res.json({
    success: true,
    message: "Status updated",
    data: contact,
  });
});

export const deleteContact = asyncHandler(async (req: AuthRequest, res: Response) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) {
    throw new NotFoundError("Contact message not found");
  }
  res.json({ success: true, message: "Contact message deleted" });
});
