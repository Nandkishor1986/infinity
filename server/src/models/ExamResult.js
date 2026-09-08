import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    marksObtained: { type: Number, min: 0 },
    grade: String,
    remarks: String,
    evaluatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

schema.index({ examId: 1, studentId: 1 }, { unique: true });

export default mongoose.model('ExamResult', schema);
