import express from "express";

import {
  listStudents,
  createStudent,
  getStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/student.controller.js";

import {
  protect,
  allowRoles,
} from "../middleware/auth.js";

const router = express.Router();

router.use(protect);


// GET ALL STUDENTS
router.get(
  "/",
  allowRoles("SUPER_ADMIN", "ADMIN", "TEACHER"),
  listStudents
);


// CREATE STUDENT
router.post(
  "/",
  allowRoles("SUPER_ADMIN", "ADMIN"),
  createStudent
);


// GET SINGLE STUDENT
router.get(
  "/:id",
  allowRoles("SUPER_ADMIN", "ADMIN", "TEACHER"),
  getStudent
);


// UPDATE STUDENT
router.put(
  "/:id",
  allowRoles("SUPER_ADMIN", "ADMIN"),
  updateStudent
);


// DELETE STUDENT
router.delete(
  "/:id",
  allowRoles("SUPER_ADMIN", "ADMIN"),
  deleteStudent
);

export default router;