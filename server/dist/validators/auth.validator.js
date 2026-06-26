import { body } from "express-validator";
export const registerValidator = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("phone")
        .trim()
        .matches(/^[6-9]\d{9}$/)
        .withMessage("Valid 10-digit Indian phone number is required"),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .matches(/[A-Z]/)
        .withMessage("Password must contain an uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password must contain a lowercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain a number"),
    body("goal").optional().trim().isLength({ max: 200 }),
];
export const loginValidator = [
    body("login").trim().notEmpty().withMessage("Email or phone is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("rememberMe").optional().isBoolean(),
];
export const forgotPasswordValidator = [
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
];
export const resetPasswordValidator = [
    body("token").trim().notEmpty().withMessage("Reset token is required"),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .matches(/[A-Z]/)
        .withMessage("Password must contain an uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password must contain a lowercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain a number"),
];
export const updateProfileValidator = [
    body("name").optional().trim().notEmpty(),
    body("phone")
        .optional()
        .matches(/^[6-9]\d{9}$/)
        .withMessage("Valid 10-digit Indian phone number is required"),
    body("email").optional().isEmail().normalizeEmail(),
    body("goal").optional().trim().isLength({ max: 200 }),
    body("avatar").optional().isURL(),
];
export const changePasswordValidator = [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .matches(/[A-Z]/)
        .withMessage("Password must contain an uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password must contain a lowercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain a number"),
];
