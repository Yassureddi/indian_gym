import { Router } from "express";
import { validate } from "../middleware/validate.middleware.js";
import { authenticate, adminOnly, memberOrAdmin } from "../middleware/auth.middleware.js";
import {
  listPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
  getPaymentSummary,
} from "../controllers/payment.controller.js";
import {
  paymentIdValidator,
  listPaymentsValidator,
  createPaymentValidator,
  updatePaymentValidator,
} from "../validators/payment.validator.js";

const router = Router();

router.use(authenticate, memberOrAdmin);

router.get("/summary", adminOnly, getPaymentSummary);
router.get("/", listPaymentsValidator, validate, listPayments);
router.get("/:id", paymentIdValidator, validate, getPayment);

router.post("/", adminOnly, createPaymentValidator, validate, createPayment);
router.put("/:id", adminOnly, updatePaymentValidator, validate, updatePayment);
router.delete("/:id", adminOnly, paymentIdValidator, validate, deletePayment);

export default router;
