import { Blog } from "../models/Blog.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination, paginatedResponse } from "../utils/pagination.js";
import { slugify } from "../utils/slug.js";
import { ConflictError, NotFoundError } from "../utils/ApiError.js";
export const listBlogs = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query);
    const filter = { isPublished: true };
    if (req.query.category)
        filter.category = req.query.category;
    if (req.query.search) {
        const term = String(req.query.search).trim();
        filter.$or = [
            { title: { $regex: term, $options: "i" } },
            { excerpt: { $regex: term, $options: "i" } },
        ];
    }
    const [blogs, total] = await Promise.all([
        Blog.find(filter)
            .select("-content")
            .sort({ publishedAt: -1 })
            .skip(skip)
            .limit(limit),
        Blog.countDocuments(filter),
    ]);
    res.json(paginatedResponse(blogs, total, page, limit));
});
export const listBlogsAdmin = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query);
    const filter = {};
    if (req.query.category)
        filter.category = req.query.category;
    if (req.query.search) {
        const term = String(req.query.search).trim();
        filter.$or = [
            { title: { $regex: term, $options: "i" } },
            { excerpt: { $regex: term, $options: "i" } },
        ];
    }
    const [blogs, total] = await Promise.all([
        Blog.find(filter).sort({ publishedAt: -1 }).skip(skip).limit(limit),
        Blog.countDocuments(filter),
    ]);
    res.json(paginatedResponse(blogs, total, page, limit));
});
export const getBlogBySlug = asyncHandler(async (req, res) => {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true });
    if (!blog) {
        throw new NotFoundError("Blog not found");
    }
    res.json({ success: true, data: blog });
});
export const getBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        throw new NotFoundError("Blog not found");
    }
    res.json({ success: true, data: blog });
});
export const createBlog = asyncHandler(async (req, res) => {
    const slug = req.body.slug || slugify(req.body.title);
    const existing = await Blog.findOne({ slug });
    if (existing) {
        throw new ConflictError("Blog slug already exists");
    }
    const blog = await Blog.create({
        ...req.body,
        slug,
        publishedAt: req.body.publishedAt ? new Date(req.body.publishedAt) : new Date(),
    });
    res.status(201).json({
        success: true,
        message: "Blog created",
        data: blog,
    });
});
export const updateBlog = asyncHandler(async (req, res) => {
    const updates = { ...req.body };
    if (updates.title && !updates.slug) {
        updates.slug = slugify(updates.title);
    }
    if (updates.slug) {
        const conflict = await Blog.findOne({
            slug: updates.slug,
            _id: { $ne: req.params.id },
        });
        if (conflict) {
            throw new ConflictError("Blog slug already exists");
        }
    }
    if (updates.publishedAt) {
        updates.publishedAt = new Date(updates.publishedAt);
    }
    const blog = await Blog.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
    });
    if (!blog) {
        throw new NotFoundError("Blog not found");
    }
    res.json({
        success: true,
        message: "Blog updated",
        data: blog,
    });
});
export const deleteBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
        throw new NotFoundError("Blog not found");
    }
    res.json({ success: true, message: "Blog deleted" });
});
