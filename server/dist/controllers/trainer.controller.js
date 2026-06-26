import { Trainer } from "../models/Trainer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination, paginatedResponse } from "../utils/pagination.js";
import { NotFoundError } from "../utils/ApiError.js";
export const listTrainers = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query);
    const [trainers, total] = await Promise.all([
        Trainer.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 }).skip(skip).limit(limit),
        Trainer.countDocuments({ isActive: true }),
    ]);
    res.json(paginatedResponse(trainers, total, page, limit));
});
export const listTrainersAdmin = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query);
    const [trainers, total] = await Promise.all([
        Trainer.find().sort({ sortOrder: 1, createdAt: -1 }).skip(skip).limit(limit),
        Trainer.countDocuments(),
    ]);
    res.json(paginatedResponse(trainers, total, page, limit));
});
export const getTrainer = asyncHandler(async (req, res) => {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
        throw new NotFoundError("Trainer not found");
    }
    res.json({ success: true, data: trainer });
});
export const createTrainer = asyncHandler(async (req, res) => {
    const trainer = await Trainer.create(req.body);
    res.status(201).json({
        success: true,
        message: "Trainer created",
        data: trainer,
    });
});
export const updateTrainer = asyncHandler(async (req, res) => {
    const trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!trainer) {
        throw new NotFoundError("Trainer not found");
    }
    res.json({
        success: true,
        message: "Trainer updated",
        data: trainer,
    });
});
export const deleteTrainer = asyncHandler(async (req, res) => {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) {
        throw new NotFoundError("Trainer not found");
    }
    res.json({ success: true, message: "Trainer deleted" });
});
