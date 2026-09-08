
import Admission from "../models/Admission.js";
import Student from "../models/Student.js";
import Enquiry from "../models/Enquiry.js";
import Course from "../models/Course.js";


// ==========================================
// Generate Enquiry Number
// ==========================================

async function generateEnquiryNumber() {
  const year = new Date().getFullYear();

  const lastEnquiry = await Enquiry.findOne({
    enquiryNumber: {
      $regex: `^ICI-ENQ-${year}-`,
    },
  }).sort({
    createdAt: -1,
  });

  let nextNumber = 1;

  if (lastEnquiry?.enquiryNumber) {
    const parts = lastEnquiry.enquiryNumber.split("-");
    nextNumber = Number(parts[3]) + 1;
  }

  return `ICI-ENQ-${year}-${String(nextNumber).padStart(5, "0")}`;
}


// ==========================================
// PUBLIC — CREATE ENQUIRY
// ==========================================

export async function createPublicEnquiry(req, res, next) {
  try {
    const {
      name,
      phone,
      email,
      courseId,
      message,
    } = req.body || {};

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone are required",
      });
    }

    // Check course if supplied
    if (courseId) {
      const course = await Course.findOne({
        _id: courseId,
        isActive: true,
      });

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Selected course not found",
        });
      }
    }

    const enquiryNumber = await generateEnquiryNumber();

    const enquiry = await Enquiry.create({
      enquiryNumber,
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim(),
      courseId: courseId || undefined,
      source: "WEBSITE",
      message: message?.trim(),
      status: "NEW",
    });

    const populatedEnquiry = await Enquiry.findById(
      enquiry._id
    ).populate("courseId", "courseCode name");

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: populatedEnquiry,
    });
  } catch (error) {
    next(error);
  }
}

async function generateApplicationNumber() {
  const year = new Date().getFullYear();

  const lastAdmission = await Admission.findOne({
    applicationNumber: {
      $regex: `^ICI-ADM-${year}-`,
    },
  }).sort({
    createdAt: -1,
  });

  let nextNumber = 1;

  if (lastAdmission?.applicationNumber) {
    const parts =
      lastAdmission.applicationNumber.split("-");

    nextNumber = Number(parts[3]) + 1;
  }

  return `ICI-ADM-${year}-${String(nextNumber).padStart(5, "0")}`;
}
// ==========================================
// ADMIN — LIST ENQUIRIES
// ==========================================

export async function listEnquiries(req, res, next) {
  try {
    const enquiries = await Enquiry.find()
      .populate("courseId", "courseCode name")
      .populate("assignedTo", "name email")
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    next(error);
  }
}


// ==========================================
// ADMIN — GET SINGLE ENQUIRY
// ==========================================

export async function getEnquiry(req, res, next) {
  try {
    const enquiry = await Enquiry.findById(req.params.id)
      .populate("courseId", "courseCode name")
      .populate("assignedTo", "name email");

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
}


// ==========================================
// ADMIN — UPDATE ENQUIRY
// ==========================================

export async function updateEnquiry(req, res, next) {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    const allowedFields = [
      "name",
      "phone",
      "email",
      "courseId",
      "source",
      "message",
      "status",
      "assignedTo",
      "followUpDate",
      "notes",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        enquiry[field] = req.body[field];
      }
    }

    await enquiry.save();

    const updatedEnquiry = await Enquiry.findById(
      enquiry._id
    )
      .populate("courseId", "courseCode name")
      .populate("assignedTo", "name email");

    res.json({
      success: true,
      message: "Enquiry updated successfully",
      data: updatedEnquiry,
    });
  } catch (error) {
    next(error);
  }
}


// ==========================================
// ADMIN — DELETE ENQUIRY
// ==========================================

export async function deleteEnquiry(req, res, next) {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    await Enquiry.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}


// ========================================
// CONVERT ENQUIRY TO ADMISSION
// ========================================

export async function convertEnquiryToAdmission(
  req,
  res,
  next
) {
  let createdStudent = null;
  let createdAdmission = null;

  try {
    const { id } = req.params;

    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phone,
      email,
      address,
      guardianName,
      guardianPhone,
      courseId,
      batchId,
      admissionDate,
      remarks,
    } = req.body || {};

    // --------------------------------
    // FIND ENQUIRY
    // --------------------------------

    const enquiry = await Enquiry.findById(id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    // --------------------------------
    // CHECK ALREADY CONVERTED
    // --------------------------------

    const existingAdmission =
      await Admission.findOne({
        enquiryId: enquiry._id,
      });

    if (existingAdmission) {
      return res.status(409).json({
        success: false,
        message:
          "This enquiry has already been converted to an admission",
        data: existingAdmission,
      });
    }

    // --------------------------------
    // COURSE
    // --------------------------------

    const selectedCourseId =
      courseId || enquiry.courseId;

    if (!selectedCourseId) {
      return res.status(400).json({
        success: false,
        message:
          "Course is required before converting enquiry",
      });
    }

    const course = await Course.findOne({
      _id: selectedCourseId,
      isActive: true,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Selected course not found",
      });
    }

    // --------------------------------
    // REQUIRED STUDENT INFORMATION
    // --------------------------------

    const studentFirstName =
      firstName?.trim() ||
      enquiry.name?.trim();

    const studentPhone =
      phone?.trim() ||
      enquiry.phone?.trim();

    if (!studentFirstName) {
      return res.status(400).json({
        success: false,
        message: "Student first name is required",
      });
    }

    if (!studentPhone) {
      return res.status(400).json({
        success: false,
        message: "Student phone is required",
      });
    }

    // --------------------------------
    // GENERATE STUDENT ID
    // --------------------------------
    async function generateStudentId() {
  const year = new Date().getFullYear();

  const lastStudent = await Student.findOne({
    studentId: {
      $regex: `^ICI-STU-${year}-`,
    },
  }).sort({
    createdAt: -1,
  });

  let nextNumber = 1;

  if (lastStudent?.studentId) {
    const parts = lastStudent.studentId.split("-");
    nextNumber = Number(parts[3]) + 1;
  }

  return `ICI-STU-${year}-${String(nextNumber).padStart(5, "0")}`;
}

    const studentId = await generateStudentId();

async function generateApplicationNumber() {
  const year = new Date().getFullYear();

  const lastAdmission = await Admission.findOne({
    applicationNumber: {
      $regex: `^ICI-ADM-${year}-`,
    },
  }).sort({
    createdAt: -1,
  });

  let nextNumber = 1;

  if (lastAdmission?.applicationNumber) {
    const parts = lastAdmission.applicationNumber.split("-");
    nextNumber = Number(parts[3]) + 1;
  }

  return `ICI-ADM-${year}-${String(nextNumber).padStart(5, "0")}`;
}


    // --------------------------------
    // CREATE STUDENT
    // --------------------------------

    createdStudent = await Student.create({
      studentId,

      firstName: studentFirstName,

      lastName:
        lastName?.trim() || "",

      dateOfBirth:
        dateOfBirth || undefined,

      gender:
        gender || undefined,

      phone: studentPhone,

      email:
        email?.trim() ||
        enquiry.email?.trim() ||
        undefined,

      address:
        address?.trim() || undefined,

      guardianName:
        guardianName?.trim() || undefined,

      guardianPhone:
        guardianPhone?.trim() || undefined,

      admissionDate:
        admissionDate || new Date(),

      course: course.name,

      batch: "",

      status: "ACTIVE",

      notes:
        remarks?.trim() ||
        `Converted from enquiry ${enquiry.enquiryNumber}`,
    });

    // --------------------------------
    // GENERATE APPLICATION NUMBER
    // --------------------------------

    const applicationNumber =
      await generateApplicationNumber();

    // --------------------------------
    // CREATE ADMISSION
    // --------------------------------

    createdAdmission =
      await Admission.create({
        applicationNumber,

        enquiryId: enquiry._id,

        studentId: createdStudent._id,

        courseId: selectedCourseId,

        batchId: batchId || undefined,

        applicationDate:
          admissionDate || new Date(),

        status: "PENDING",

        remarks:
          remarks?.trim() || undefined,
      });

    // --------------------------------
    // UPDATE ENQUIRY
    // --------------------------------

    enquiry.status = "CONVERTED";

    enquiry.notes = [
      enquiry.notes,
      `Converted to admission ${applicationNumber}`,
    ]
      .filter(Boolean)
      .join("\n");

    await enquiry.save();

    // --------------------------------
    // POPULATE RESULT
    // --------------------------------

    const populatedAdmission =
      await Admission.findById(
        createdAdmission._id
      )
        .populate(
          "studentId",
          "studentId firstName lastName phone email"
        )
        .populate(
          "courseId",
          "courseCode name totalFees"
        )
        .populate(
          "enquiryId",
          "enquiryNumber name phone status"
        );

    // --------------------------------
    // RESPONSE
    // --------------------------------

    res.status(201).json({
      success: true,
      message:
        "Enquiry converted to admission successfully",

      data: populatedAdmission,
    });
  } catch (error) {
    // --------------------------------
    // CLEANUP IF SOMETHING FAILS
    // --------------------------------

    try {
      if (createdAdmission?._id) {
        await Admission.findByIdAndDelete(
          createdAdmission._id
        );
      }

      if (createdStudent?._id) {
        await Student.findByIdAndDelete(
          createdStudent._id
        );
      }
    } catch (cleanupError) {
      console.error(
        "Conversion cleanup failed:",
        cleanupError
      );
    }

    next(error);
  }
}