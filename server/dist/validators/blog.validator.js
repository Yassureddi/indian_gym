import { body, param, query } from "express-validator";
export const blogIdValidator = [
    param("id").isMongoId().withMessage("Invalid blog ID"),
];
export const slugValidator = [
    param("slug").trim().notEmpty(),
];
export const listBlogsValidator = [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("category").optional().trim(),
    query("search").optional().trim(),
];
export const createBlogValidator = [
    body("title").trim().notEmpty(),
    body("slug").optional().trim(),
    body("excerpt").trim().notEmpty(),
    body("content").trim().notEmpty(),
    body("category").trim().notEmpty(),
    body("image").trim().notEmpty(),
    body("readTime").optional().trim(),
    body("publishedAt").optional().isISO8601(),
    body("isPublished").optional().isBoolean(),
];
export const updateBlogValidator = [
    ...blogIdValidator,
    body("title").optional().trim().notEmpty(),
    body("slug").optional().trim(),
    body("excerpt").optional().trim().notEmpty(),
    body("content").optional().trim().notEmpty(),
    body("category").optional().trim().notEmpty(),
    body("image").optional().trim().notEmpty(),
    body("readTime").optional().trim(),
    body("publishedAt").optional().isISO8601(),
    body("isPublished").optional().isBoolean(),
];
