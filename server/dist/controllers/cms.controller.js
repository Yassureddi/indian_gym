import { CmsContent, } from "../models/CmsContent.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination, paginatedResponse } from "../utils/pagination.js";
import { BadRequestError, NotFoundError } from "../utils/ApiError.js";
function buildFilter(type, query, publishedOnly) {
    const filter = { type };
    if (publishedOnly) {
        filter.isPublished = true;
    }
    if (query.group && type === "stat") {
        filter["data.group"] = String(query.group);
    }
    if (query.userId && (type === "workout-plan" || type === "diet-plan")) {
        filter["data.userId"] = String(query.userId);
    }
    return filter;
}
export const listCmsPublic = asyncHandler(async (req, res) => {
    const type = String(req.query.type);
    if (!type) {
        throw new BadRequestError("Content type is required");
    }
    const { page, limit, skip } = getPagination(req.query);
    const filter = buildFilter(type, req.query, true);
    const [items, total] = await Promise.all([
        CmsContent.find(filter).sort({ sortOrder: 1, createdAt: -1 }).skip(skip).limit(limit),
        CmsContent.countDocuments(filter),
    ]);
    res.json(paginatedResponse(items, total, page, limit));
});
export const listCmsAdmin = asyncHandler(async (req, res) => {
    const type = String(req.query.type);
    if (!type) {
        throw new BadRequestError("Content type is required");
    }
    const { page, limit, skip } = getPagination(req.query);
    const filter = buildFilter(type, req.query, false);
    const [items, total] = await Promise.all([
        CmsContent.find(filter).sort({ sortOrder: 1, createdAt: -1 }).skip(skip).limit(limit),
        CmsContent.countDocuments(filter),
    ]);
    res.json(paginatedResponse(items, total, page, limit));
});
export const getCmsItem = asyncHandler(async (req, res) => {
    const item = await CmsContent.findById(req.params.id);
    if (!item) {
        throw new NotFoundError("Content item not found");
    }
    res.json({ success: true, data: item });
});
export const createCmsItem = asyncHandler(async (req, res) => {
    const item = await CmsContent.create(req.body);
    res.status(201).json({
        success: true,
        message: "Content created",
        data: item,
    });
});
export const updateCmsItem = asyncHandler(async (req, res) => {
    const existing = await CmsContent.findById(req.params.id);
    if (!existing) {
        throw new NotFoundError("Content item not found");
    }
    const updates = { ...req.body };
    if (updates.data && typeof updates.data === "object") {
        updates.data = { ...existing.data, ...updates.data };
    }
    const item = await CmsContent.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
    });
    if (!item) {
        throw new NotFoundError("Content item not found");
    }
    res.json({
        success: true,
        message: "Content updated",
        data: item,
    });
});
export const deleteCmsItem = asyncHandler(async (req, res) => {
    const item = await CmsContent.findByIdAndDelete(req.params.id);
    if (!item) {
        throw new NotFoundError("Content item not found");
    }
    res.json({ success: true, message: "Content deleted" });
});
export const getSiteSettings = asyncHandler(async (_req, res) => {
    const settings = await CmsContent.findOne({ type: "site-settings", isPublished: true }).sort({
        updatedAt: -1,
    });
    res.json({
        success: true,
        data: settings?.data ?? {},
    });
});
export const updateSiteSettings = asyncHandler(async (req, res) => {
    let settings = await CmsContent.findOne({ type: "site-settings" }).sort({ updatedAt: -1 });
    if (!settings) {
        settings = await CmsContent.create({
            type: "site-settings",
            title: "Site Settings",
            data: req.body,
            isPublished: true,
            sortOrder: 0,
        });
    }
    else {
        settings.data = { ...settings.data, ...req.body };
        settings.markModified("data");
        await settings.save();
    }
    res.json({
        success: true,
        message: "Site settings updated",
        data: settings.data,
    });
});
