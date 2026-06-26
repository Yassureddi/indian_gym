import { Router } from "express";
import rateLimit from "express-rate-limit";
import { validate } from "../middleware/validate.middleware.js";
import { authenticate, adminOnly } from "../middleware/auth.middleware.js";
import {
  submitContact,
  listContacts,
  getContact,
  updateContactStatus,
  deleteContact,
} from "../controllers/contact.controller.js";
import {
  contactIdValidator,
  submitContactValidator,
  listContactsValidator,
  updateContactStatusValidator,
} from "../validators/contact.validator.js";

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many contact requests. Try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", contactLimiter, submitContactValidator, validate, submitContact);

router.use(authenticate, adminOnly);
router.get("/", listContactsValidator, validate, listContacts);
router.get("/:id", contactIdValidator, validate, getContact);
router.patch("/:id/status", updateContactStatusValidator, validate, updateContactStatus);
router.delete("/:id", contactIdValidator, validate, deleteContact);

export default router;
