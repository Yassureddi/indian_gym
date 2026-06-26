import { Router } from "express";
import { validate } from "../middleware/validate.middleware.js";
import { authenticate, memberOrAdmin } from "../middleware/auth.middleware.js";
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  updateProfileValidator,
  changePasswordValidator,
} from "../validators/auth.validator.js";

const router = Router();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.post("/forgot-password", forgotPasswordValidator, validate, forgotPassword);
router.post("/reset-password", resetPasswordValidator, validate, resetPassword);

router.post("/logout", authenticate, logout);
router.get("/me", authenticate, memberOrAdmin, getMe);
router.put("/me", authenticate, memberOrAdmin, updateProfileValidator, validate, updateProfile);
router.put(
  "/change-password",
  authenticate,
  memberOrAdmin,
  changePasswordValidator,
  validate,
  changePassword
);

export default router;
