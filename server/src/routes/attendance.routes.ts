import { Router } from "express";
import { validate } from "../middleware/validate.middleware.js";
import { authenticate, adminOnly, memberOrAdmin } from "../middleware/auth.middleware.js";
import {
  listAttendance,
  checkIn,
  checkOut,
  getMyAttendance,
  getAttendanceStats,
} from "../controllers/attendance.controller.js";
import {
  attendanceIdValidator,
  listAttendanceValidator,
  checkInValidator,
  checkOutValidator,
} from "../validators/attendance.validator.js";

const router = Router();

router.use(authenticate, memberOrAdmin);

router.get("/me", getMyAttendance);
router.get("/stats", adminOnly, getAttendanceStats);
router.get("/", listAttendanceValidator, validate, listAttendance);
router.post("/check-in", checkInValidator, validate, checkIn);
router.put("/:id/check-out", checkOutValidator, validate, checkOut);

export default router;
