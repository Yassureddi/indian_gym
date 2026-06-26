import { body, param, query } from "express-validator";

export const trainerIdValidator = [
  param("id").isMongoId().withMessage("Invalid trainer ID"),
];

export const listTrainersValidator = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
];

export const createTrainerValidator = [
  body("name").trim().notEmpty(),
  body("role").trim().notEmpty(),
  body("specialty").trim().notEmpty(),
  body("experience").trim().notEmpty(),
  body("image").trim().notEmpty(),
  body("bio").trim().notEmpty(),
  body("certificates").optional().isArray(),
  body("social").optional().isObject(),
  body("isActive").optional().isBoolean(),
  body("sortOrder").optional().isInt({ min: 0 }),
];

export const updateTrainerValidator = [
  ...trainerIdValidator,
  body("name").optional().trim().notEmpty(),
  body("role").optional().trim().notEmpty(),
  body("specialty").optional().trim().notEmpty(),
  body("experience").optional().trim().notEmpty(),
  body("image").optional().trim().notEmpty(),
  body("bio").optional().trim().notEmpty(),
  body("certificates").optional().isArray(),
  body("social").optional().isObject(),
  body("isActive").optional().isBoolean(),
  body("sortOrder").optional().isInt({ min: 0 }),
];
