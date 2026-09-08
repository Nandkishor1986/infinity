import express from "express";

import {
  createPublicEnquiry,
  listEnquiries,
  getEnquiry,
  updateEnquiry,
  deleteEnquiry,
  convertEnquiryToAdmission,
} from "../controllers/enquiry.controller.js";

import {
  protect,
  allowRoles,
} from "../middleware/auth.js";

const router = express.Router();

// ==========================================
// PUBLIC — WEBSITE ENQUIRY
// No login required
// ==========================================

router.post(
  "/public",
  createPublicEnquiry
);

// ==========================================
// PROTECTED — ADMIN ENQUIRIES
// ==========================================

router.use(protect);

// ==========================================
// LIST ENQUIRIES
// ==========================================

router.get(
  "/",
  allowRoles(
    "SUPER_ADMIN",
    "ADMIN",
    "COUNSELOR",
    "RECEPTIONIST"
  ),
  listEnquiries
);

// ==========================================
// CONVERT ENQUIRY → ADMISSION
// ==========================================

router.post(
  "/:id/convert",
  allowRoles(
    "SUPER_ADMIN",
    "ADMIN",
    "COUNSELOR",
    "RECEPTIONIST"
  ),
  convertEnquiryToAdmission
);

// ==========================================
// GET SINGLE ENQUIRY
// ==========================================

router.get(
  "/:id",
  allowRoles(
    "SUPER_ADMIN",
    "ADMIN",
    "COUNSELOR",
    "RECEPTIONIST"
  ),
  getEnquiry
);

// ==========================================
// UPDATE ENQUIRY
// ==========================================

router.put(
  "/:id",
  allowRoles(
    "SUPER_ADMIN",
    "ADMIN",
    "COUNSELOR",
    "RECEPTIONIST"
  ),
  updateEnquiry
);

// ==========================================
// DELETE ENQUIRY
// ==========================================

router.delete(
  "/:id",
  allowRoles(
    "SUPER_ADMIN",
    "ADMIN"
  ),
  deleteEnquiry
);

export default router;