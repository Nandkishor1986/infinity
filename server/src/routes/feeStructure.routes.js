import express from "express";

import {
  createFeeStructure,
  listFeeStructures,
  getFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
} from "../controllers/feeStructure.controller.js";

import { protect, allowRoles } from "../middleware/auth.js";

const router = express.Router();

// List all fee structures
router.get(
  "/",
  protect,
  allowRoles("SUPER_ADMIN", "ADMIN", "ACCOUNTANT"),
  listFeeStructures
);

// Create fee structure
router.post(
  "/",
  protect,
  allowRoles("SUPER_ADMIN", "ADMIN", "ACCOUNTANT"),
  createFeeStructure
);

// Get single fee structure
router.get(
  "/:id",
  protect,
  allowRoles("SUPER_ADMIN", "ADMIN", "ACCOUNTANT"),
  getFeeStructure
);

// Update fee structure
router.put(
  "/:id",
  protect,
  allowRoles("SUPER_ADMIN", "ADMIN", "ACCOUNTANT"),
  updateFeeStructure
);

// Delete fee structure
router.delete(
  "/:id",
  protect,
  allowRoles("SUPER_ADMIN", "ADMIN"),
  deleteFeeStructure
);

export default router;