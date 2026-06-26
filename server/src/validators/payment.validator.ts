import { body, param, query } from "express-validator";

export const paymentIdValidator = [
  param("id").isMongoId().withMessage("Invalid payment ID"),
];

export const listPaymentsValidator = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("userId").optional().isMongoId(),
  query("status").optional().isIn(["completed", "pending", "failed"]),
  query("from").optional().isISO8601(),
  query("to").optional().isISO8601(),
];

export const createPaymentValidator = [
  body("memberName").trim().notEmpty(),
  body("amount").isFloat({ min: 0 }),
  body("method").isIn(["upi", "cash", "card"]),
  body("planName").trim().notEmpty(),
  body("userId").optional().isMongoId(),
  body("status").optional().isIn(["completed", "pending", "failed"]),
  body("date").optional().isISO8601(),
  body("reference").optional().trim(),
];

export const updatePaymentValidator = [
  ...paymentIdValidator,
  body("memberName").optional().trim().notEmpty(),
  body("amount").optional().isFloat({ min: 0 }),
  body("method").optional().isIn(["upi", "cash", "card"]),
  body("planName").optional().trim().notEmpty(),
  body("status").optional().isIn(["completed", "pending", "failed"]),
  body("date").optional().isISO8601(),
  body("reference").optional().trim(),
];
