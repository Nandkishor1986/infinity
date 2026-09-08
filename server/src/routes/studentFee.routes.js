import express from "express";

import {
  createStudentFee,
  listStudentFees,
  getStudentFee,
  updateStudentFee,
  deleteStudentFee,
} from "../controllers/studentFee.controller.js";

import { protect, allowRoles } from "../middleware/auth.js";

const router = express.Router();

// List all student fees
router.get(
  "/",
  protect,
  allowRoles("SUPER_ADMIN", "ADMIN", "ACCOUNTANT"),
  listStudentFees
);

// Create student fee
router.post(
  "/",
  protect,
  allowRoles("SUPER_ADMIN", "ADMIN", "ACCOUNTANT"),
  createStudentFee
);

// Get single student fee
router.get(
  "/:id",
  protect,
  allowRoles("SUPER_ADMIN", "ADMIN", "ACCOUNTANT"),
  getStudentFee
);

// Update student fee
router.put(
  "/:id",
  protect,
  allowRoles("SUPER_ADMIN", "ADMIN", "ACCOUNTANT"),
  updateStudentFee
);

// Delete student fee
router.delete(
  "/:id",
  protect,
  allowRoles("SUPER_ADMIN", "ADMIN"),
  deleteStudentFee
);

export default router;