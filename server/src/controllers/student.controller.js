import Student from "../models/Student.js";

function generateStudentId() {
  const year = new Date().getFullYear();

  const randomNumber = Math.floor(
    10000 + Math.random() * 90000
  );

  return `ICI-STU-${year}-${randomNumber}`;
}


// ===============================
// GET ALL STUDENTS
// ===============================
export async function listStudents(req, res, next) {
  try {
    const students = await Student.find({
      isDeleted: false,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    next(error);
  }
}


// ===============================
// CREATE STUDENT
// ===============================
export async function createStudent(req, res, next) {
  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      dateOfBirth,
      gender,
      address,
      guardianName,
      guardianPhone,
      admissionDate,
      course,
      batch,
      photo,
      notes,
    } = req.body || {};

    if (!firstName || !phone) {
      return res.status(400).json({
        success: false,
        message: "First name and phone are required",
      });
    }

    // Generate unique Student ID
    let studentId;

    do {
      studentId = generateStudentId();
    } while (await Student.exists({ studentId }));

    const student = await Student.create({
      studentId,
      firstName,
      lastName,
      phone,
      email,
      dateOfBirth,
      gender,
      address,
      guardianName,
      guardianPhone,
      admissionDate,
      course,
      batch,
      photo,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    next(error);
  }
}


// ===============================
// GET SINGLE STUDENT
// ===============================
export async function getStudent(req, res, next) {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
}


// ===============================
// UPDATE STUDENT
// ===============================
export async function updateStudent(req, res, next) {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const allowedFields = [
      "firstName",
      "lastName",
      "phone",
      "email",
      "dateOfBirth",
      "gender",
      "address",
      "guardianName",
      "guardianPhone",
      "admissionDate",
      "course",
      "batch",
      "photo",
      "status",
      "notes",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        student[field] = req.body[field];
      }
    }

    await student.save();

    res.json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    next(error);
  }
}


// ===============================
// PERMANENT DELETE STUDENT
// ===============================
export async function deleteStudent(req, res, next) {
  try {
    console.log("DELETE STUDENT ID:", req.params.id);

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    console.log(
      "FOUND STUDENT:",
      student.studentId,
      student.firstName,
      student.lastName
    );

    const deletedStudent =
      await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(500).json({
        success: false,
        message: "Student could not be deleted",
      });
    }

    console.log(
      "DELETED STUDENT:",
      deletedStudent.studentId
    );

    res.json({
      success: true,
      message: "Student permanently deleted",
      data: {
        id: deletedStudent._id,
        studentId: deletedStudent.studentId,
      },
    });
  } catch (error) {
    console.error("DELETE STUDENT ERROR:", error);
    next(error);
  }
}