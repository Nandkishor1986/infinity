import Course from "../models/Course.js";


// ==========================================
// LIST COURSES
// ==========================================

export async function listCourses(req, res, next) {
  try {
    const courses = await Course.find({
      isActive: true,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
}

export async function listPublicCourses(req, res, next) {
  try {
    const courses = await Course.find({
      isActive: true,
    })
      .select(
        "courseCode name description duration totalFees syllabus"
      )
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
}
// ==========================================
// CREATE COURSE
// ==========================================

export async function createCourse(req, res, next) {
  try {
    const {
      courseCode,
      name,
      description,
      duration,
      totalFees,
      syllabus,
      isActive,
    } = req.body || {};

    if (!courseCode || !name) {
      return res.status(400).json({
        success: false,
        message: "Course code and course name are required",
      });
    }

    const existingCourse = await Course.findOne({
      courseCode: courseCode.toUpperCase(),
    });

    if (existingCourse) {
      return res.status(409).json({
        success: false,
        message: "Course code already exists",
      });
    }

    const course = await Course.create({
      courseCode: courseCode.toUpperCase(),
      name,
      description,
      duration,
      totalFees,
      syllabus,
      isActive:
        isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
}


// ==========================================
// GET SINGLE COURSE
// ==========================================

export async function getCourse(req, res, next) {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
}


// ==========================================
// UPDATE COURSE
// ==========================================

export async function updateCourse(req, res, next) {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const allowedFields = [
      "courseCode",
      "name",
      "description",
      "duration",
      "totalFees",
      "syllabus",
      "isActive",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        course[field] = req.body[field];
      }
    }

    if (req.body.courseCode) {
      course.courseCode =
        req.body.courseCode.toUpperCase();
    }

    await course.save();

    res.json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
}


// ==========================================
// DELETE COURSE
// ==========================================

export async function deleteCourse(req, res, next) {
  try {
    const course = await Course.findById(
      req.params.id
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Soft delete
    course.isActive = false;

    await course.save();

    res.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}