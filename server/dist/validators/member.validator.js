import { body, param, query } from "express-validator";
export const memberIdValidator = [
    param("id").isMongoId().withMessage("Invalid member ID"),
];
export const listMembersValidator = [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("search").optional().trim(),
    query("role").optional().isIn(["admin", "member"]),
    query("isActive").optional().isBoolean(),
];
export const createMemberValidator = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().normalizeEmail(),
    body("phone")
        .matches(/^[6-9]\d{9}$/)
        .withMessage("Valid 10-digit Indian phone number is required"),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),
    body("role").optional().isIn(["admin", "member"]),
    body("goal").optional().trim(),
    body("membership").optional().isObject(),
    body("membership.planId").optional().trim().notEmpty(),
    body("membership.planName").optional().trim().notEmpty(),
    body("membership.amount").optional().isFloat({ min: 0 }),
    body("membership.startDate").optional().isISO8601(),
    body("membership.endDate").optional().isISO8601(),
];
export const updateMemberValidator = [
    ...memberIdValidator,
    body("name").optional().trim().notEmpty(),
    body("email").optional().isEmail().normalizeEmail(),
    body("phone").optional().matches(/^[6-9]\d{9}$/),
    body("goal").optional().trim(),
    body("avatar").optional().isURL(),
    body("isActive").optional().isBoolean(),
    body("role").optional().isIn(["admin", "member"]),
];
