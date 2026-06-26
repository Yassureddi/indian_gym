import type { Response } from "express";
import { Membership } from "../models/Membership.model.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getMyMembership = asyncHandler(async (req: AuthRequest, res: Response) => {
  const membership = await Membership.findOne({ userId: req.user!.sub }).sort({
    createdAt: -1,
  });

  res.json({ success: true, data: membership });
});
