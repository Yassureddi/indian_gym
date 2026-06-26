import { Router } from "express";
import authRoutes from "./auth.routes.js";
import memberRoutes from "./member.routes.js";
import attendanceRoutes from "./attendance.routes.js";
import paymentRoutes from "./payment.routes.js";
import galleryRoutes from "./gallery.routes.js";
import blogRoutes from "./blog.routes.js";
import trainerRoutes from "./trainer.routes.js";
import membershipRoutes from "./membership.routes.js";
import contactRoutes from "./contact.routes.js";
import cmsRoutes from "./cms.routes.js";
const router = Router();
router.get("/health", (_req, res) => {
    res.json({
        success: true,
        message: "KN Raju Fitness API is running",
        timestamp: new Date().toISOString(),
    });
});
router.use("/auth", authRoutes);
router.use("/members", memberRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/payments", paymentRoutes);
router.use("/gallery", galleryRoutes);
router.use("/blogs", blogRoutes);
router.use("/trainers", trainerRoutes);
router.use("/membership", membershipRoutes);
router.use("/contact", contactRoutes);
router.use("/cms", cmsRoutes);
export default router;
