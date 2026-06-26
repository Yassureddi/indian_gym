import { Payment } from "../models/Payment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination, paginatedResponse } from "../utils/pagination.js";
import { ForbiddenError, NotFoundError } from "../utils/ApiError.js";
export const listPayments = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query);
    const isAdmin = req.user.role === "admin";
    const filter = {};
    if (isAdmin && req.query.userId) {
        filter.userId = req.query.userId;
    }
    else if (!isAdmin) {
        filter.userId = req.user.sub;
    }
    if (req.query.status)
        filter.status = req.query.status;
    if (req.query.from || req.query.to) {
        filter.date = {};
        if (req.query.from)
            filter.date.$gte = new Date(String(req.query.from));
        if (req.query.to)
            filter.date.$lte = new Date(String(req.query.to));
    }
    const [payments, total] = await Promise.all([
        Payment.find(filter)
            .populate("userId", "name email phone")
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit),
        Payment.countDocuments(filter),
    ]);
    res.json(paginatedResponse(payments, total, page, limit));
});
export const getPayment = asyncHandler(async (req, res) => {
    const payment = await Payment.findById(req.params.id).populate("userId", "name email phone");
    if (!payment) {
        throw new NotFoundError("Payment not found");
    }
    const isAdmin = req.user.role === "admin";
    if (!isAdmin && String(payment.userId?._id || payment.userId) !== req.user.sub) {
        throw new ForbiddenError();
    }
    res.json({ success: true, data: payment });
});
export const createPayment = asyncHandler(async (req, res) => {
    const payment = await Payment.create({
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : new Date(),
    });
    res.status(201).json({
        success: true,
        message: "Payment recorded",
        data: payment,
    });
});
export const updatePayment = asyncHandler(async (req, res) => {
    const updates = { ...req.body };
    if (updates.date)
        updates.date = new Date(updates.date);
    const payment = await Payment.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
    });
    if (!payment) {
        throw new NotFoundError("Payment not found");
    }
    res.json({
        success: true,
        message: "Payment updated",
        data: payment,
    });
});
export const deletePayment = asyncHandler(async (req, res) => {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
        throw new NotFoundError("Payment not found");
    }
    res.json({ success: true, message: "Payment deleted" });
});
export const getPaymentSummary = asyncHandler(async (_req, res) => {
    const [completed, pending, failed, revenue] = await Promise.all([
        Payment.countDocuments({ status: "completed" }),
        Payment.countDocuments({ status: "pending" }),
        Payment.countDocuments({ status: "failed" }),
        Payment.aggregate([
            { $match: { status: "completed" } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
    ]);
    const monthlyRevenue = await Payment.aggregate([
        { $match: { status: "completed" } },
        {
            $group: {
                _id: {
                    year: { $year: "$date" },
                    month: { $month: "$date" },
                },
                total: { $sum: "$amount" },
                count: { $sum: 1 },
            },
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 12 },
    ]);
    res.json({
        success: true,
        data: {
            counts: { completed, pending, failed },
            totalRevenue: revenue[0]?.total || 0,
            monthlyRevenue,
        },
    });
});
