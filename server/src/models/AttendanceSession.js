import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    date: { type: Date, required: true },
    startTime: String,
    endTime: String,
    topic: String
  },
  { timestamps: true }
);

export default mongoose.model('AttendanceSession', schema);
