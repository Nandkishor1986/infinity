import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    attachmentUrl: String,
    assignedDate: { type: Date, default: Date.now },
    dueDate: Date,
    totalMarks: { type: Number, min: 0 },
    status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'CLOSED'], default: 'DRAFT' }
  },
  { timestamps: true }
);

export default mongoose.model('Assignment', assignmentSchema);
