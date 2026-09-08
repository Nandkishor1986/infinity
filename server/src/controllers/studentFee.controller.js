import StudentFee from "../models/StudentFee.js";
import Student from "../models/Student.js";
import Enrollment from "../models/Enrollment.js";
import FeeStructure from "../models/FeeStructure.js";

function calculateFeeStatus(finalAmount, paidAmount, dueDate, currentStatus) {
  if (currentStatus === "CANCELLED") {
    return "CANCELLED";
  }

  if (paidAmount >= finalAmount) {
    return "PAID";
  }

  if (dueDate && new Date(dueDate) < new Date()) {
    return "OVERDUE";
  }

  if (paidAmount > 0) {
    return "PARTIAL";
  }

  return "PENDING";
}

function calculateAmounts(totalAmount, discount = 0, paidAmount = 0) {
  const finalAmount = Math.max(0, totalAmount - discount);
  const safePaidAmount = Math.min(Math.max(0, paidAmount), finalAmount);
  const balanceAmount = finalAmount - safePaidAmount;

  return {
    finalAmount,
    paidAmount: safePaidAmount,
    balanceAmount,
  };
}

// CREATE STUDENT FEE
export async function createStudentFee(req, res, next) {
  try {
    const {
      studentId,
      enrollmentId,
      feeStructureId,
      totalAmount,
      discount = 0,
      paidAmount = 0,
      dueDate,
      status,
    } = req.body;

    if (!studentId || !enrollmentId || totalAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Student, enrollment and total amount are required",
      });
    }

    if (totalAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "Total amount cannot be negative",
      });
    }

    if (discount < 0) {
      return res.status(400).json({
        success: false,
        message: "Discount cannot be negative",
      });
    }

    if (discount > totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Discount cannot be greater than total amount",
      });
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    if (enrollment.studentId.toString() !== studentId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Enrollment does not belong to this student",
      });
    }

    if (feeStructureId) {
      const feeStructure = await FeeStructure.findById(feeStructureId);

      if (!feeStructure) {
        return res.status(404).json({
          success: false,
          message: "Fee structure not found",
        });
      }
    }

    const amounts = calculateAmounts(
      Number(totalAmount),
      Number(discount),
      Number(paidAmount)
    );

    const feeStatus = calculateFeeStatus(
      amounts.finalAmount,
      amounts.paidAmount,
      dueDate,
      status
    );

    const studentFee = await StudentFee.create({
      studentId,
      enrollmentId,
      feeStructureId: feeStructureId || undefined,
      totalAmount: Number(totalAmount),
      discount: Number(discount),
      finalAmount: amounts.finalAmount,
      paidAmount: amounts.paidAmount,
      balanceAmount: amounts.balanceAmount,
      dueDate: dueDate || undefined,
      status: feeStatus,
    });

    const populatedFee = await StudentFee.findById(studentFee._id)
      .populate("studentId", "studentId firstName lastName phone email")
      .populate("enrollmentId", "enrollmentDate status")
      .populate("feeStructureId", "name totalAmount");

    res.status(201).json({
      success: true,
      message: "Student fee created successfully",
      studentFee: populatedFee,
    });
  } catch (error) {
    next(error);
  }
}

// LIST STUDENT FEES
export async function listStudentFees(req, res, next) {
  try {
    const { status, studentId, enrollmentId } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (studentId) {
      filter.studentId = studentId;
    }

    if (enrollmentId) {
      filter.enrollmentId = enrollmentId;
    }

    const studentFees = await StudentFee.find(filter)
      .populate(
        "studentId",
        "studentId firstName lastName phone email"
      )
      .populate(
        "enrollmentId",
        "enrollmentDate status"
      )
      .populate(
        "feeStructureId",
        "name totalAmount"
      )
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: studentFees.length,
      studentFees,
    });
  } catch (error) {
    next(error);
  }
}

// GET SINGLE STUDENT FEE
export async function getStudentFee(req, res, next) {
  try {
    const { id } = req.params;

    const studentFee = await StudentFee.findById(id)
      .populate(
        "studentId",
        "studentId firstName lastName phone email"
      )
      .populate(
        "enrollmentId",
        "studentId courseId batchId admissionId enrollmentDate completionDate status"
      )
      .populate(
        "feeStructureId",
        "name totalAmount installments isActive"
      );

    if (!studentFee) {
      return res.status(404).json({
        success: false,
        message: "Student fee not found",
      });
    }

    res.json({
      success: true,
      studentFee,
    });
  } catch (error) {
    next(error);
  }
}

// UPDATE STUDENT FEE
export async function updateStudentFee(req, res, next) {
  try {
    const { id } = req.params;

    const studentFee = await StudentFee.findById(id);

    if (!studentFee) {
      return res.status(404).json({
        success: false,
        message: "Student fee not found",
      });
    }

    const {
      studentId,
      enrollmentId,
      feeStructureId,
      totalAmount,
      discount,
      paidAmount,
      dueDate,
      status,
    } = req.body;

    if (studentId) {
      const student = await Student.findById(studentId);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      studentFee.studentId = studentId;
    }

    if (enrollmentId) {
      const enrollment = await Enrollment.findById(enrollmentId);

      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: "Enrollment not found",
        });
      }

      const currentStudentId =
        studentId || studentFee.studentId.toString();

      if (enrollment.studentId.toString() !== currentStudentId.toString()) {
        return res.status(400).json({
          success: false,
          message: "Enrollment does not belong to this student",
        });
      }

      studentFee.enrollmentId = enrollmentId;
    }

    if (feeStructureId !== undefined) {
      if (feeStructureId) {
        const feeStructure = await FeeStructure.findById(feeStructureId);

        if (!feeStructure) {
          return res.status(404).json({
            success: false,
            message: "Fee structure not found",
          });
        }

        studentFee.feeStructureId = feeStructureId;
      } else {
        studentFee.feeStructureId = undefined;
      }
    }

    const newTotalAmount =
      totalAmount !== undefined
        ? Number(totalAmount)
        : studentFee.totalAmount;

    const newDiscount =
      discount !== undefined
        ? Number(discount)
        : studentFee.discount;

    const newPaidAmount =
      paidAmount !== undefined
        ? Number(paidAmount)
        : studentFee.paidAmount;

    if (newTotalAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "Total amount cannot be negative",
      });
    }

    if (newDiscount < 0) {
      return res.status(400).json({
        success: false,
        message: "Discount cannot be negative",
      });
    }

    if (newDiscount > newTotalAmount) {
      return res.status(400).json({
        success: false,
        message: "Discount cannot be greater than total amount",
      });
    }

    if (newPaidAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "Paid amount cannot be negative",
      });
    }

    const amounts = calculateAmounts(
      newTotalAmount,
      newDiscount,
      newPaidAmount
    );

    studentFee.totalAmount = newTotalAmount;
    studentFee.discount = newDiscount;
    studentFee.finalAmount = amounts.finalAmount;
    studentFee.paidAmount = amounts.paidAmount;
    studentFee.balanceAmount = amounts.balanceAmount;

    if (dueDate !== undefined) {
      studentFee.dueDate = dueDate || undefined;
    }

    const requestedStatus =
      status !== undefined ? status : studentFee.status;

    studentFee.status = calculateFeeStatus(
      amounts.finalAmount,
      amounts.paidAmount,
      studentFee.dueDate,
      requestedStatus
    );

    await studentFee.save();

    const updatedFee = await StudentFee.findById(studentFee._id)
      .populate(
        "studentId",
        "studentId firstName lastName phone email"
      )
      .populate(
        "enrollmentId",
        "enrollmentDate status"
      )
      .populate(
        "feeStructureId",
        "name totalAmount"
      );

    res.json({
      success: true,
      message: "Student fee updated successfully",
      studentFee: updatedFee,
    });
  } catch (error) {
    next(error);
  }
}

// DELETE STUDENT FEE
export async function deleteStudentFee(req, res, next) {
  try {
    const { id } = req.params;

    const studentFee = await StudentFee.findById(id);

    if (!studentFee) {
      return res.status(404).json({
        success: false,
        message: "Student fee not found",
      });
    }

    await StudentFee.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Student fee deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}