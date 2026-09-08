import express from "express";

import {
  listCourses,
  listPublicCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";

import {
  protect,
  allowRoles,
} from "../middleware/auth.js";

const router = express.Router();

/* =================================
   PUBLIC COURSES
   No login required
================================= */

router.get("/public", listPublicCourses);


/* =================================
   PROTECTED COURSE ROUTES
================================= */

router.use(protect);

router.get(
  "/",
  allowRoles("SUPER_ADMIN", "ADMIN", "TEACHER"),
  listCourses
);

router.post(
  "/",
  allowRoles("SUPER_ADMIN", "ADMIN"),
  createCourse
);

router.get(
  "/:id",
  allowRoles("SUPER_ADMIN", "ADMIN", "TEACHER"),
  getCourse
);

router.put(
  "/:id",
  allowRoles("SUPER_ADMIN", "ADMIN"),
  updateCourse
);

router.delete(
  "/:id",
  allowRoles("SUPER_ADMIN", "ADMIN"),
  deleteCourse
);

export default router;