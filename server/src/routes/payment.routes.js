import express from "express";

import {
  createPaymentOrder,
  verifyPayment,
  listPayments,
  getPayment,
} from "../controllers/payment.controller.js";

import {
  protect,
  allowRoles,
} from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/",
  protect,
  allowRoles("SUPER_ADMIN", "ADMIN", "ACCOUNTANT"),
  listPayments
);

router.post(
  "/create-order",
  protect,
  allowRoles("SUPER_ADMIN", "ADMIN", "ACCOUNTANT"),
  createPaymentOrder
);

router.post(
  "/verify",
  protect,
  allowRoles("SUPER_ADMIN", "ADMIN", "ACCOUNTANT"),
  verifyPayment
);

router.get(
  "/:id",
  protect,
  allowRoles("SUPER_ADMIN", "ADMIN", "ACCOUNTANT"),
  getPayment
);

export default router;