import FeeStructure from "../models/FeeStructure.js";
import Course from "../models/Course.js";

// CREATE FEE STRUCTURE
export async function createFeeStructure(req, res, next) {
  try {
    const {
      courseId,
      name,
      totalAmount,
      installments = [],
      isActive = true,
    } = req.body;

    // Basic validation
    if (!courseId || !name || totalAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: "courseId, name and totalAmount are required",
      });
    }

    if (Number(totalAmount) < 0) {
      return res.status(400).json({
        success: false,
        message: "totalAmount cannot be negative",
      });
    }

    // Check course exists
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Validate installments
    if (!Array.isArray(installments)) {
      return res.status(400).json({
        success: false,
        message: "installments must be an array",
      });
    }

    for (const installment of installments) {
      if (!installment.name || installment.amount === undefined) {
        return res.status(400).json({
          success: false,
          message: "Each installment must have name and amount",
        });
      }

      if (Number(installment.amount) < 0) {
        return res.status(400).json({
          success: false,
          message: "Installment amount cannot be negative",
        });
      }

      if (
        installment.dueAfterDays !== undefined &&
        Number(installment.dueAfterDays) < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "dueAfterDays cannot be negative",
        });
      }
    }

    const feeStructure = await FeeStructure.create({
      courseId,
      name: name.trim(),
      totalAmount: Number(totalAmount),
      installments,
      isActive,
    });

    const populatedFeeStructure = await FeeStructure.findById(
      feeStructure._id
    ).populate("courseId", "courseCode name totalFees");

    res.status(201).json({
      success: true,
      message: "Fee structure created successfully",
      feeStructure: populatedFeeStructure,
    });
  } catch (error) {
    next(error);
  }
}


// GET ALL FEE STRUCTURES
export async function listFeeStructures(req, res, next) {
  try {
    const feeStructures = await FeeStructure.find()
      .populate("courseId", "courseCode name totalFees")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: feeStructures.length,
      feeStructures,
    });
  } catch (error) {
    next(error);
  }
}


// GET SINGLE FEE STRUCTURE
export async function getFeeStructure(req, res, next) {
  try {
    const feeStructure = await FeeStructure.findById(req.params.id)
      .populate("courseId", "courseCode name totalFees");

    if (!feeStructure) {
      return res.status(404).json({
        success: false,
        message: "Fee structure not found",
      });
    }

    res.json({
      success: true,
      feeStructure,
    });
  } catch (error) {
    next(error);
  }
}


// UPDATE FEE STRUCTURE
export async function updateFeeStructure(req, res, next) {
  try {
    const {
      courseId,
      name,
      totalAmount,
      installments,
      isActive,
    } = req.body;

    const feeStructure = await FeeStructure.findById(req.params.id);

    if (!feeStructure) {
      return res.status(404).json({
        success: false,
        message: "Fee structure not found",
      });
    }

    // If course is being changed, check that it exists
    if (courseId && courseId !== feeStructure.courseId.toString()) {
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      feeStructure.courseId = courseId;
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Fee structure name cannot be empty",
        });
      }

      feeStructure.name = name.trim();
    }

    if (totalAmount !== undefined) {
      if (Number(totalAmount) < 0) {
        return res.status(400).json({
          success: false,
          message: "totalAmount cannot be negative",
        });
      }

      feeStructure.totalAmount = Number(totalAmount);
    }

    if (installments !== undefined) {
      if (!Array.isArray(installments)) {
        return res.status(400).json({
          success: false,
          message: "installments must be an array",
        });
      }

      for (const installment of installments) {
        if (!installment.name || installment.amount === undefined) {
          return res.status(400).json({
            success: false,
            message: "Each installment must have name and amount",
          });
        }

        if (Number(installment.amount) < 0) {
          return res.status(400).json({
            success: false,
            message: "Installment amount cannot be negative",
          });
        }

        if (
          installment.dueAfterDays !== undefined &&
          Number(installment.dueAfterDays) < 0
        ) {
          return res.status(400).json({
            success: false,
            message: "dueAfterDays cannot be negative",
          });
        }
      }

      feeStructure.installments = installments;
    }

    if (isActive !== undefined) {
      feeStructure.isActive = Boolean(isActive);
    }

    await feeStructure.save();

    const updatedFeeStructure = await FeeStructure.findById(
      feeStructure._id
    ).populate("courseId", "courseCode name totalFees");

    res.json({
      success: true,
      message: "Fee structure updated successfully",
      feeStructure: updatedFeeStructure,
    });
  } catch (error) {
    next(error);
  }
}


// DELETE FEE STRUCTURE
export async function deleteFeeStructure(req, res, next) {
  try {
    const feeStructure = await FeeStructure.findById(req.params.id);

    if (!feeStructure) {
      return res.status(404).json({
        success: false,
        message: "Fee structure not found",
      });
    }

    await FeeStructure.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Fee structure deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}