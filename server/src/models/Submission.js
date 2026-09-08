import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    fileUrl: String,
    submittedAt: { type: Date, default: Date.now },
    marks: Number,
    feedback: String,
    status: { type: String, enum: ['SUBMITTED', 'GRADED', 'LATE', 'RETURNED'], default: 'SUBMITTED' },
    gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    gradedAt: Date
  },
  { timestamps: true }
);

export default mongoose.model('Submission', submissionSchema);
