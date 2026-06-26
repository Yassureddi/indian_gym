import { Router } from "express";
import { validate } from "../middleware/validate.middleware.js";
import { authenticate, adminOnly } from "../middleware/auth.middleware.js";
import {
  listBlogs,
  listBlogsAdmin,
  getBlogBySlug,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";
import {
  blogIdValidator,
  slugValidator,
  listBlogsValidator,
  createBlogValidator,
  updateBlogValidator,
} from "../validators/blog.validator.js";

const router = Router();

router.get("/", listBlogsValidator, validate, listBlogs);
router.get("/slug/:slug", slugValidator, validate, getBlogBySlug);
router.get("/admin/all", authenticate, adminOnly, listBlogsAdmin);
router.get("/:id", blogIdValidator, validate, getBlog);

router.post("/", authenticate, adminOnly, createBlogValidator, validate, createBlog);
router.put("/:id", authenticate, adminOnly, updateBlogValidator, validate, updateBlog);
router.delete("/:id", authenticate, adminOnly, blogIdValidator, validate, deleteBlog);

export default router;
