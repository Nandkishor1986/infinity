import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    admissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admission' },
    enrollmentDate: { type: Date, default: Date.now },
    completionDate: Date,
    status: { type: String, enum: ['ACTIVE', 'COMPLETED', 'DROPPED', 'TRANSFERRED'], default: 'ACTIVE' }
  },
  { timestamps: true }
);

export default mongoose.model('Enrollment', enrollmentSchema);
