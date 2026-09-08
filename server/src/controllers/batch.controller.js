import Batch from "../models/Batch.js";
import Course from "../models/Course.js";
import Teacher from "../models/Teacher.js";

function validateSchedule(schedule) {
  if (schedule === undefined) {
    return true;
  }

  if (schedule === null || typeof schedule !== "object") {
    return false;
  }

  if (schedule.days !== undefined && !Array.isArray(schedule.days)) {
    return false;
  }

  return true;
}

// CREATE BATCH
export async function createBatch(req, res, next) {
  try {
    const {
      batchCode,
      name,
      courseId,
      teacherId,
      startDate,
      endDate,
      schedule,
      room,
      capacity,
      status,
    } = req.body;

    if (!batchCode || !name || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Batch code, name and course are required",
      });
    }

    if (!validateSchedule(schedule)) {
      return res.status(400).json({
        success: false,
        message: "Invalid schedule format",
      });
    }

    const existingBatch = await Batch.findOne({ batchCode });

    if (existingBatch) {
      return res.status(409).json({
        success: false,
        message: "Batch code already exists",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (teacherId) {
      const teacher = await Teacher.findById(teacherId);

      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: "Teacher not found",
        });
      }
    }

    const batch = await Batch.create({
      batchCode,
      name,
      courseId,
      teacherId: teacherId || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      schedule,
      room,
      capacity,
      status: status || "UPCOMING",
    });

    const populatedBatch = await Batch.findById(batch._id)
      .populate(
        "courseId",
        "courseCode name description duration totalFees"
      )
      .populate(
        "teacherId",
        "employeeId firstName lastName name email phone"
      );

    res.status(201).json({
      success: true,
      message: "Batch created successfully",
      batch: populatedBatch,
    });
  } catch (error) {
    next(error);
  }
}

// LIST BATCHES
export async function listBatches(req, res, next) {
  try {
    const {
      courseId,
      teacherId,
      status,
    } = req.query;

    const filter = {};

    if (courseId) {
      filter.courseId = courseId;
    }

    if (teacherId) {
      filter.teacherId = teacherId;
    }

    if (status) {
      filter.status = status;
    }

    const batches = await Batch.find(filter)
      .populate(
        "courseId",
        "courseCode name description duration totalFees"
      )
      .populate(
        "teacherId",
        "employeeId firstName lastName name email phone"
      )
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: batches.length,
      batches,
    });
  } catch (error) {
    next(error);
  }
}

// GET SINGLE BATCH
export async function getBatch(req, res, next) {
  try {
    const { id } = req.params;

    const batch = await Batch.findById(id)
      .populate(
        "courseId",
        "courseCode name description duration totalFees syllabus"
      )
      .populate(
        "teacherId",
        "employeeId firstName lastName name email phone"
      );

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    res.json({
      success: true,
      batch,
    });
  } catch (error) {
    next(error);
  }
}

// UPDATE BATCH
export async function updateBatch(req, res, next) {
  try {
    const { id } = req.params;

    const batch = await Batch.findById(id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    const {
      batchCode,
      name,
      courseId,
      teacherId,
      startDate,
      endDate,
      schedule,
      room,
      capacity,
      status,
    } = req.body;

    if (schedule !== undefined && !validateSchedule(schedule)) {
      return res.status(400).json({
        success: false,
        message: "Invalid schedule format",
      });
    }

    if (batchCode && batchCode !== batch.batchCode) {
      const existingBatch = await Batch.findOne({
        batchCode,
        _id: { $ne: batch._id },
      });

      if (existingBatch) {
        return res.status(409).json({
          success: false,
          message: "Batch code already exists",
        });
      }

      batch.batchCode = batchCode;
    }

    if (courseId) {
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      batch.courseId = courseId;
    }

    if (teacherId !== undefined) {
      if (teacherId) {
        const teacher = await Teacher.findById(teacherId);

        if (!teacher) {
          return res.status(404).json({
            success: false,
            message: "Teacher not found",
          });
        }

        batch.teacherId = teacherId;
      } else {
        batch.teacherId = undefined;
      }
    }

    if (name !== undefined) batch.name = name;
    if (startDate !== undefined) batch.startDate = startDate || undefined;
    if (endDate !== undefined) batch.endDate = endDate || undefined;
    if (schedule !== undefined) batch.schedule = schedule;
    if (room !== undefined) batch.room = room;
    if (capacity !== undefined) batch.capacity = capacity;
    if (status !== undefined) batch.status = status;

    await batch.save();

    const updatedBatch = await Batch.findById(batch._id)
      .populate(
        "courseId",
        "courseCode name description duration totalFees"
      )
      .populate(
        "teacherId",
        "employeeId firstName lastName name email phone"
      );

    res.json({
      success: true,
      message: "Batch updated successfully",
      batch: updatedBatch,
    });
  } catch (error) {
    next(error);
  }
}

// DELETE BATCH
export async function deleteBatch(req, res, next) {
  try {
    const { id } = req.params;

    const batch = await Batch.findById(id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    await Batch.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Batch deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}