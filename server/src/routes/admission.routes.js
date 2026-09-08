import express from "express";

import {
  listAdmissions,
  getAdmission,
  approveAdmission,
  rejectAdmission,
  cancelAdmission,
  deleteAdmission,
} from "../controllers/admission.controller.js";

import {
  protect,
  allowRoles,
} from "../middleware/auth.js";

const router = express.Router();

router.use(protect);


// ==========================================
// LIST ADMISSIONS
// ==========================================
router.get(
  "/",
  allowRoles(
    "SUPER_ADMIN",
    "ADMIN",
    "COUNSELOR",
    "RECEPTIONIST"
  ),
  listAdmissions
);


// ==========================================
// APPROVE
// ==========================================
router.put(
  "/:id/approve",
  allowRoles(
    "SUPER_ADMIN",
    "ADMIN"
  ),
  approveAdmission
);


// ==========================================
// REJECT
// ==========================================
router.put(
  "/:id/reject",
  allowRoles(
    "SUPER_ADMIN",
    "ADMIN"
  ),
  rejectAdmission
);


// ==========================================
// CANCEL
// ==========================================
router.put(
  "/:id/cancel",
  allowRoles(
    "SUPER_ADMIN",
    "ADMIN"
  ),
  cancelAdmission
);


// ==========================================
// GET SINGLE ADMISSION
// ==========================================
router.get(
  "/:id",
  allowRoles(
    "SUPER_ADMIN",
    "ADMIN",
    "COUNSELOR",
    "RECEPTIONIST"
  ),
  getAdmission
);


// ==========================================
// DELETE
// ==========================================
router.delete(
  "/:id",
  allowRoles(
    "SUPER_ADMIN",
    "ADMIN"
  ),
  deleteAdmission
);


export default router;