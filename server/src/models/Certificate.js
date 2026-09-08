import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    certificateNumber: { type: String, required: true, unique: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    enrollmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    issueDate: { type: Date, default: Date.now },
    completionDate: Date,
    certificateUrl: String,
    verificationCode: { type: String, required: true, unique: true },
    status: { type: String, enum: ['ISSUED', 'REVOKED'], default: 'ISSUED' },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Certificate', schema);
