import express from "express";

import {
  createEnrollment,
  listEnrollments,
  getEnrollment,
  updateEnrollment,
  deleteEnrollment,
} from "../controllers/enrollment.controller.js";

import { protect, allowRoles } from "../middleware/auth.js";

const router = express.Router();

// List enrollments
router.get(
  "/",
  protect,
  allowRoles("SUPER_ADMIN", "ADMIN", "COUNSELOR", "RECEPTIONIST"),
  listEnrollments
);

// Create enrollment
router.post(
  "/",
  protect,
  allowRoles("SUPER_ADMIN", "ADMIN"),
  createEnrollment
);

// Get single enrollment
router.get(
  "/:id",
  protect,
  allowRoles("SUPER_ADMIN", "ADMIN", "COUNSELOR", "RECEPTIONIST"),
  getEnrollment
);

// Update enrollment
router.put(
  "/:id",
  protect,
  allowRoles("SUPER_ADMIN", "ADMIN"),
  updateEnrollment
);

// Delete enrollment
router.delete(
  "/:id",
  protect,
  allowRoles("SUPER_ADMIN", "ADMIN"),
  deleteEnrollment
);

export default router;