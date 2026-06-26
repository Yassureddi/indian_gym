import { Membership } from "../models/Membership.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
export const getMyMembership = asyncHandler(async (req, res) => {
    const membership = await Membership.findOne({ userId: req.user.sub }).sort({
        createdAt: -1,
    });
    res.json({ success: true, data: membership });
});
