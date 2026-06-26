import { Router } from "express";
import { body, param, query } from "express-validator";
import { validate } from "../middleware/validate.middleware.js";
import { authenticate, adminOnly } from "../middleware/auth.middleware.js";
import { listCmsPublic, listCmsAdmin, getCmsItem, createCmsItem, updateCmsItem, deleteCmsItem, getSiteSettings, updateSiteSettings, } from "../controllers/cms.controller.js";
const router = Router();
const cmsTypes = [
    "faq",
    "testimonial",
    "service",
    "transformation",
    "pricing-plan",
    "stat",
    "journey",
    "facility",
    "notification",
    "workout-plan",
    "diet-plan",
];
const listValidator = [
    query("type").isIn(cmsTypes).withMessage("Valid content type is required"),
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("group").optional().trim(),
    query("userId").optional().isMongoId(),
];
const createValidator = [
    body("type").isIn(cmsTypes),
    body("slug").optional().trim(),
    body("title").optional().trim(),
    body("data").isObject(),
    body("isPublished").optional().isBoolean(),
    body("sortOrder").optional().isInt({ min: 0 }),
];
const updateValidator = [
    param("id").isMongoId(),
    body("slug").optional().trim(),
    body("title").optional().trim(),
    body("data").optional().isObject(),
    body("isPublished").optional().isBoolean(),
    body("sortOrder").optional().isInt({ min: 0 }),
];
router.get("/site-settings", getSiteSettings);
router.put("/site-settings", authenticate, adminOnly, updateSiteSettings);
router.get("/", listValidator, validate, listCmsPublic);
router.get("/admin/all", authenticate, adminOnly, listValidator, validate, listCmsAdmin);
router.get("/:id", param("id").isMongoId(), validate, getCmsItem);
router.post("/", authenticate, adminOnly, createValidator, validate, createCmsItem);
router.put("/:id", authenticate, adminOnly, updateValidator, validate, updateCmsItem);
router.delete("/:id", authenticate, adminOnly, param("id").isMongoId(), validate, deleteCmsItem);
export default router;
