import express from "express";

import {
  createBatch,
  listBatches,
  getBatch,
  updateBatch,
  deleteBatch,
} from "../controllers/batch.controller.js";

import { protect, allowRoles } from "../middleware/auth.js";

const router = express.Router();

// List batches
router.get(
  "/",
  protect,
  allowRoles("SUPER_ADMIN", "ADMIN", "TEACHER"),
  listBatches
);

// Create batch
router.post(
  "/",
  protect,
  allowRoles("SUPER_ADMIN", "ADMIN"),
  createBatch
);

// Get single batch
router.get(
  "/:id",
  protect,
  allowRoles("SUPER_ADMIN", "ADMIN", "TEACHER"),
  getBatch
);

// Update batch
router.put(
  "/:id",
  protect,
  allowRoles("SUPER_ADMIN", "ADMIN"),
  updateBatch
);

// Delete batch
router.delete(
  "/:id",
  protect,
  allowRoles("SUPER_ADMIN", "ADMIN"),
  deleteBatch
);

export default router;