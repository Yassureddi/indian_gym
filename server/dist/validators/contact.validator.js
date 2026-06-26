import { body, param, query } from "express-validator";
export const contactIdValidator = [
    param("id").isMongoId().withMessage("Invalid contact ID"),
];
export const submitContactValidator = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("phone")
        .trim()
        .matches(/^[6-9]\d{9}$/)
        .withMessage("Valid 10-digit Indian phone number is required"),
    body("goal").optional().trim().isLength({ max: 200 }),
    body("message")
        .trim()
        .notEmpty()
        .withMessage("Message is required")
        .isLength({ max: 2000 }),
];
export const listContactsValidator = [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("status").optional().isIn(["new", "read", "replied", "archived"]),
];
export const updateContactStatusValidator = [
    ...contactIdValidator,
    body("status").isIn(["new", "read", "replied", "archived"]),
];
