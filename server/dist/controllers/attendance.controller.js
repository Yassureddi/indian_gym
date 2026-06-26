import { Attendance } from "../models/Attendance.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination, paginatedResponse } from "../utils/pagination.js";
import { BadRequestError, ForbiddenError, NotFoundError } from "../utils/ApiError.js";
function todayDate() {
    return new Date().toISOString().split("T")[0];
}
function currentTime() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}
export const listAttendance = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query);
    const isAdmin = req.user.role === "admin";
    const filter = {};
    if (isAdmin && req.query.userId) {
        filter.userId = req.query.userId;
    }
    else if (!isAdmin) {
        filter.userId = req.user.sub;
    }
    if (req.query.date)
        filter.date = req.query.date;
    if (req.query.from || req.query.to) {
        filter.date = {};
        if (req.query.from)
            filter.date.$gte = String(req.query.from);
        if (req.query.to)
            filter.date.$lte = String(req.query.to);
    }
    const [records, total] = await Promise.all([
        Attendance.find(filter)
            .populate("userId", "name email phone")
            .sort({ date: -1, checkIn: -1 })
            .skip(skip)
            .limit(limit),
        Attendance.countDocuments(filter),
    ]);
    res.json(paginatedResponse(records, total, page, limit));
});
export const checkIn = asyncHandler(async (req, res) => {
    const isAdmin = req.user.role === "admin";
    const userId = isAdmin && req.body.userId ? req.body.userId : req.user.sub;
    if (!isAdmin && req.body.userId && req.body.userId !== req.user.sub) {
        throw new ForbiddenError("Cannot check in for another user");
    }
    const date = req.body.date || todayDate();
    const checkIn = req.body.checkIn || currentTime();
    const existing = await Attendance.findOne({ userId, date });
    if (existing) {
        throw new BadRequestError("Already checked in for this date");
    }
    const record = await Attendance.create({ userId, date, checkIn });
    res.status(201).json({
        success: true,
        message: "Checked in successfully",
        data: record,
    });
});
export const checkOut = asyncHandler(async (req, res) => {
    const record = await Attendance.findById(req.params.id);
    if (!record) {
        throw new NotFoundError("Attendance record not found");
    }
    const isAdmin = req.user.role === "admin";
    if (!isAdmin && String(record.userId) !== req.user.sub) {
        throw new ForbiddenError();
    }
    if (record.checkOut) {
        throw new BadRequestError("Already checked out");
    }
    record.checkOut = req.body.checkOut || currentTime();
    await record.save();
    res.json({
        success: true,
        message: "Checked out successfully",
        data: record,
    });
});
export const getMyAttendance = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query);
    const filter = { userId: req.user.sub };
    const [records, total] = await Promise.all([
        Attendance.find(filter).sort({ date: -1 }).skip(skip).limit(limit),
        Attendance.countDocuments(filter),
    ]);
    res.json(paginatedResponse(records, total, page, limit));
});
export const getAttendanceStats = asyncHandler(async (req, res) => {
    const today = todayDate();
    const monthStart = today.slice(0, 7);
    const [todayCount, monthCount, totalCount] = await Promise.all([
        Attendance.countDocuments({ date: today }),
        Attendance.countDocuments({ date: { $regex: `^${monthStart}` } }),
        Attendance.countDocuments(),
    ]);
    res.json({
        success: true,
        data: { todayCount, monthCount, totalCount },
    });
});
