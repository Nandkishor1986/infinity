import Enrollment from "../models/Enrollment.js";
import Student from "../models/Student.js";
import Course from "../models/Course.js";
import Batch from "../models/Batch.js";
import Admission from "../models/Admission.js";

// CREATE ENROLLMENT
export async function createEnrollment(req, res, next) {
  try {
    const {
      studentId,
      courseId,
      batchId,
      admissionId,
      enrollmentDate,
      completionDate,
      status,
    } = req.body;

    if (!studentId || !courseId || !batchId) {
      return res.status(400).json({
        success: false,
        message: "Student, course and batch are required",
      });
    }

    // Check student
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check course
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check batch
    const batch = await Batch.findById(batchId);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    // Check admission if provided
    if (admissionId) {
      const admission = await Admission.findById(admissionId);

      if (!admission) {
        return res.status(404).json({
          success: false,
          message: "Admission not found",
        });
      }

      if (
        admission.studentId &&
        admission.studentId.toString() !== studentId.toString()
      ) {
        return res.status(400).json({
          success: false,
          message: "Admission does not belong to this student",
        });
      }

      if (
        admission.courseId &&
        admission.courseId.toString() !== courseId.toString()
      ) {
        return res.status(400).json({
          success: false,
          message: "Admission does not belong to this course",
        });
      }
    }

    const enrollment = await Enrollment.create({
      studentId,
      courseId,
      batchId,
      admissionId: admissionId || undefined,
      enrollmentDate: enrollmentDate || undefined,
      completionDate: completionDate || undefined,
      status: status || "ACTIVE",
    });

    const populatedEnrollment = await Enrollment.findById(
      enrollment._id
    )
      .populate(
        "studentId",
        "studentId firstName lastName phone email"
      )
      .populate(
        "courseId",
        "courseCode name description duration totalFees"
      )
      .populate(
        "batchId"
      )
      .populate(
        "admissionId",
        "applicationNumber status applicationDate"
      );

    res.status(201).json({
      success: true,
      message: "Enrollment created successfully",
      enrollment: populatedEnrollment,
    });
  } catch (error) {
    next(error);
  }
}

// LIST ENROLLMENTS
export async function listEnrollments(req, res, next) {
  try {
    const {
      studentId,
      courseId,
      batchId,
      admissionId,
      status,
    } = req.query;

    const filter = {};

    if (studentId) {
      filter.studentId = studentId;
    }

    if (courseId) {
      filter.courseId = courseId;
    }

    if (batchId) {
      filter.batchId = batchId;
    }

    if (admissionId) {
      filter.admissionId = admissionId;
    }

    if (status) {
      filter.status = status;
    }

    const enrollments = await Enrollment.find(filter)
      .populate(
        "studentId",
        "studentId firstName lastName phone email"
      )
      .populate(
        "courseId",
        "courseCode name description duration totalFees"
      )
      .populate("batchId")
      .populate(
        "admissionId",
        "applicationNumber status applicationDate"
      )
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    next(error);
  }
}

// GET SINGLE ENROLLMENT
export async function getEnrollment(req, res, next) {
  try {
    const { id } = req.params;

    const enrollment = await Enrollment.findById(id)
      .populate(
        "studentId",
        "studentId firstName lastName phone email address"
      )
      .populate(
        "courseId",
        "courseCode name description duration totalFees syllabus"
      )
      .populate("batchId")
      .populate(
        "admissionId",
        "applicationNumber status applicationDate remarks"
      );

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    res.json({
      success: true,
      enrollment,
    });
  } catch (error) {
    next(error);
  }
}

// UPDATE ENROLLMENT
export async function updateEnrollment(req, res, next) {
  try {
    const { id } = req.params;

    const enrollment = await Enrollment.findById(id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    const {
      studentId,
      courseId,
      batchId,
      admissionId,
      enrollmentDate,
      completionDate,
      status,
    } = req.body;

    const newStudentId = studentId || enrollment.studentId;
    const newCourseId = courseId || enrollment.courseId;
    const newBatchId = batchId || enrollment.batchId;

    // Validate student
    if (studentId) {
      const student = await Student.findById(studentId);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }
    }

    // Validate course
    if (courseId) {
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }
    }

    // Validate batch
    if (batchId) {
      const batch = await Batch.findById(batchId);

      if (!batch) {
        return res.status(404).json({
          success: false,
          message: "Batch not found",
        });
      }
    }

    // Validate admission
    if (admissionId) {
      const admission = await Admission.findById(admissionId);

      if (!admission) {
        return res.status(404).json({
          success: false,
          message: "Admission not found",
        });
      }

      if (
        admission.studentId &&
        admission.studentId.toString() !==
          newStudentId.toString()
      ) {
        return res.status(400).json({
          success: false,
          message: "Admission does not belong to this student",
        });
      }

      if (
        admission.courseId &&
        admission.courseId.toString() !==
          newCourseId.toString()
      ) {
        return res.status(400).json({
          success: false,
          message: "Admission does not belong to this course",
        });
      }
    }

    if (studentId) {
      enrollment.studentId = studentId;
    }

    if (courseId) {
      enrollment.courseId = courseId;
    }

    if (batchId) {
      enrollment.batchId = batchId;
    }

    if (admissionId !== undefined) {
      enrollment.admissionId = admissionId || undefined;
    }

    if (enrollmentDate !== undefined) {
      enrollment.enrollmentDate =
        enrollmentDate || undefined;
    }

    if (completionDate !== undefined) {
      enrollment.completionDate =
        completionDate || undefined;
    }

    if (status !== undefined) {
      enrollment.status = status;
    }

    await enrollment.save();

    const updatedEnrollment = await Enrollment.findById(
      enrollment._id
    )
      .populate(
        "studentId",
        "studentId firstName lastName phone email"
      )
      .populate(
        "courseId",
        "courseCode name description duration totalFees"
      )
      .populate("batchId")
      .populate(
        "admissionId",
        "applicationNumber status applicationDate"
      );

    res.json({
      success: true,
      message: "Enrollment updated successfully",
      enrollment: updatedEnrollment,
    });
  } catch (error) {
    next(error);
  }
}

// DELETE ENROLLMENT
export async function deleteEnrollment(req, res, next) {
  try {
    const { id } = req.params;

    const enrollment = await Enrollment.findById(id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    await Enrollment.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Enrollment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}