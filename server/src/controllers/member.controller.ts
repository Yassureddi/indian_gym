import type { Response } from "express";
import type { FilterQuery } from "mongoose";
import { User, type IUserDocument } from "../models/User.model.js";
import { Membership } from "../models/Membership.model.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { hashPassword } from "../utils/password.js";
import { getPagination, paginatedResponse } from "../utils/pagination.js";
import { NotFoundError, ConflictError } from "../utils/ApiError.js";

function toMember(user: IUserDocument) {
  return {
    id: String(user._id),
    email: user.email,
    phone: user.phone,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    goal: user.goal,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export const listMembers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip } = getPagination(req.query);
  const { search, role, isActive } = req.query;

  const filter: FilterQuery<IUserDocument> = {};
  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === "true";
  if (search) {
    const term = String(search).trim();
    filter.$or = [
      { name: { $regex: term, $options: "i" } },
      { email: { $regex: term, $options: "i" } },
      { phone: { $regex: term, $options: "i" } },
    ];
  }

  const [members, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  res.json(paginatedResponse(members.map(toMember), total, page, limit));
});

export const getMember = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new NotFoundError("Member not found");
  }
  res.json({ success: true, data: toMember(user) });
});

export const createMember = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, phone, password, role, goal, membership } = req.body;

  const existing = await User.findOne({ $or: [{ email }, { phone }] });
  if (existing) {
    throw new ConflictError("Email or phone already registered");
  }

  const user = await User.create({
    name,
    email,
    phone,
    passwordHash: await hashPassword(password),
    role: role || "member",
    goal,
  });

  if (membership) {
    await Membership.create({
      userId: user._id,
      planId: membership.planId,
      planName: membership.planName,
      startDate: membership.startDate ? new Date(membership.startDate) : new Date(),
      endDate: membership.endDate
        ? new Date(membership.endDate)
        : new Date(Date.now() + 30 * 86400000),
      amount: membership.amount || 0,
      status: "active",
    });
  }

  res.status(201).json({
    success: true,
    message: "Member created",
    data: toMember(user),
  });
});

export const updateMember = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updates = { ...req.body };

  if (updates.email || updates.phone) {
    const conflict = await User.findOne({
      _id: { $ne: id },
      $or: [
        ...(updates.email ? [{ email: updates.email }] : []),
        ...(updates.phone ? [{ phone: updates.phone }] : []),
      ],
    });
    if (conflict) {
      throw new ConflictError("Email or phone already in use");
    }
  }

  const user = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    throw new NotFoundError("Member not found");
  }

  res.json({
    success: true,
    message: "Member updated",
    data: toMember(user),
  });
});

export const deleteMember = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!user) {
    throw new NotFoundError("Member not found");
  }
  res.json({ success: true, message: "Member deactivated" });
});

export const getMemberMembership = asyncHandler(async (req: AuthRequest, res: Response) => {
  const membership = await Membership.findOne({ userId: req.params.id }).sort({
    createdAt: -1,
  });
  if (!membership) {
    throw new NotFoundError("Membership not found");
  }
  res.json({ success: true, data: membership });
});
