import { Router } from "express";
import { authenticate, memberOrAdmin } from "../middleware/auth.middleware.js";
import { getMyMembership } from "../controllers/membership.controller.js";
const router = Router();
router.use(authenticate, memberOrAdmin);
router.get("/me", getMyMembership);
export default router;
