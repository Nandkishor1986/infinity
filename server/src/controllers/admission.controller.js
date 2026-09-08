import Admission from "../models/Admission.js";


// ==========================================
// GET ALL ADMISSIONS
// ==========================================
export async function listAdmissions(req, res, next) {
  try {
    const { status } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    const admissions = await Admission.find(filter)
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
      )
      .populate(
        "batchId"
      )
      .populate(
        "reviewedBy",
        "name email role"
      )
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      count: admissions.length,
      data: admissions,
    });
  } catch (error) {
    next(error);
  }
}


// ==========================================
// GET SINGLE ADMISSION
// ==========================================
export async function getAdmission(req, res, next) {
  try {
    const { id } = req.params;

    const admission = await Admission.findById(id)
      .populate(
        "studentId",
        "studentId firstName lastName phone email dateOfBirth gender address guardianName guardianPhone admissionDate status"
      )
      .populate(
        "courseId",
        "courseCode name description duration totalFees syllabus"
      )
      .populate(
        "enquiryId",
        "enquiryNumber name phone email source message status followUpDate notes"
      )
      .populate(
        "batchId"
      )
      .populate(
        "reviewedBy",
        "name email role"
      );

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "Admission not found",
      });
    }

    res.json({
      success: true,
      data: admission,
    });
  } catch (error) {
    next(error);
  }
}


// ==========================================
// APPROVE ADMISSION
// ==========================================
export async function approveAdmission(req, res, next) {
  try {
    const { id } = req.params;

    const admission = await Admission.findById(id);

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "Admission not found",
      });
    }

    if (admission.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message:
          `Admission cannot be approved because its current status is ${admission.status}`,
      });
    }

    admission.status = "APPROVED";
    admission.reviewedBy = req.user.id;
    admission.reviewedAt = new Date();

    await admission.save();

    const updatedAdmission =
      await Admission.findById(admission._id)
        .populate(
          "studentId",
          "studentId firstName lastName phone email status"
        )
        .populate(
          "courseId",
          "courseCode name totalFees"
        )
        .populate(
          "reviewedBy",
          "name email role"
        );

    res.json({
      success: true,
      message: "Admission approved successfully",
      data: updatedAdmission,
    });
  } catch (error) {
    next(error);
  }
}


// ==========================================
// REJECT ADMISSION
// ==========================================
export async function rejectAdmission(req, res, next) {
  try {
    const { id } = req.params;
    const { remarks } = req.body || {};

    const admission = await Admission.findById(id);

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "Admission not found",
      });
    }

    if (admission.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message:
          `Admission cannot be rejected because its current status is ${admission.status}`,
      });
    }

    admission.status = "REJECTED";
    admission.reviewedBy = req.user.id;
    admission.reviewedAt = new Date();

    if (remarks?.trim()) {
      admission.remarks = remarks.trim();
    }

    await admission.save();

    const updatedAdmission =
      await Admission.findById(admission._id)
        .populate(
          "studentId",
          "studentId firstName lastName phone email status"
        )
        .populate(
          "courseId",
          "courseCode name totalFees"
        )
        .populate(
          "reviewedBy",
          "name email role"
        );

    res.json({
      success: true,
      message: "Admission rejected successfully",
      data: updatedAdmission,
    });
  } catch (error) {
    next(error);
  }
}


// ==========================================
// CANCEL ADMISSION
// ==========================================
export async function cancelAdmission(req, res, next) {
  try {
    const { id } = req.params;
    const { remarks } = req.body || {};

    const admission = await Admission.findById(id);

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "Admission not found",
      });
    }

    if (
      admission.status === "CANCELLED" ||
      admission.status === "REJECTED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          `Admission cannot be cancelled because its current status is ${admission.status}`,
      });
    }

    admission.status = "CANCELLED";
    admission.reviewedBy = req.user.id;
    admission.reviewedAt = new Date();

    if (remarks?.trim()) {
      admission.remarks = remarks.trim();
    }

    await admission.save();

    const updatedAdmission =
      await Admission.findById(admission._id)
        .populate(
          "studentId",
          "studentId firstName lastName phone email status"
        )
        .populate(
          "courseId",
          "courseCode name totalFees"
        )
        .populate(
          "reviewedBy",
          "name email role"
        );

    res.json({
      success: true,
      message: "Admission cancelled successfully",
      data: updatedAdmission,
    });
  } catch (error) {
    next(error);
  }
}


// ==========================================
// DELETE ADMISSION
// ==========================================
export async function deleteAdmission(req, res, next) {
  try {
    const { id } = req.params;

    const admission = await Admission.findById(id);

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "Admission not found",
      });
    }

    await Admission.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Admission deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}