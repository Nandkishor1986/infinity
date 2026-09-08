import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema(
  {
    batchCode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    startDate: Date,
    endDate: Date,
    schedule: {
      days: [String],
      startTime: String,
      endTime: String
    },
    room: String,
    capacity: { type: Number, min: 1 },
    status: { type: String, enum: ['UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED'], default: 'UPCOMING' }
  },
  { timestamps: true }
);

export default mongoose.model('Batch', batchSchema);
