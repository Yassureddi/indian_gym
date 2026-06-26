import { Router } from "express";
import { validate } from "../middleware/validate.middleware.js";
import { authenticate, adminOnly } from "../middleware/auth.middleware.js";
import {
  listGallery,
  listGalleryAdmin,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "../controllers/gallery.controller.js";
import {
  galleryIdValidator,
  listGalleryValidator,
  createGalleryValidator,
  updateGalleryValidator,
} from "../validators/gallery.validator.js";

const router = Router();

router.get("/", listGalleryValidator, validate, listGallery);
router.get("/admin/all", authenticate, adminOnly, listGalleryAdmin);
router.get("/:id", galleryIdValidator, validate, getGalleryItem);
router.post("/", authenticate, adminOnly, createGalleryValidator, validate, createGalleryItem);
router.put(
  "/:id",
  authenticate,
  adminOnly,
  updateGalleryValidator,
  validate,
  updateGalleryItem
);
router.delete(
  "/:id",
  authenticate,
  adminOnly,
  galleryIdValidator,
  validate,
  deleteGalleryItem
);

export default router;
