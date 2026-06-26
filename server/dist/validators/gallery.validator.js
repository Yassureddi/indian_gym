import { body, param, query } from "express-validator";
export const galleryIdValidator = [
    param("id").isMongoId().withMessage("Invalid gallery ID"),
];
export const listGalleryValidator = [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("category").optional().isIn(["gym", "workout", "equipment", "members", "events"]),
];
export const createGalleryValidator = [
    body("src").trim().notEmpty(),
    body("alt").trim().notEmpty(),
    body("category").isIn(["gym", "workout", "equipment", "members", "events"]),
    body("tall").optional().isBoolean(),
    body("isPublished").optional().isBoolean(),
    body("sortOrder").optional().isInt({ min: 0 }),
];
export const updateGalleryValidator = [
    ...galleryIdValidator,
    body("src").optional().trim().notEmpty(),
    body("alt").optional().trim().notEmpty(),
    body("category").optional().isIn(["gym", "workout", "equipment", "members", "events"]),
    body("tall").optional().isBoolean(),
    body("isPublished").optional().isBoolean(),
    body("sortOrder").optional().isInt({ min: 0 }),
];
