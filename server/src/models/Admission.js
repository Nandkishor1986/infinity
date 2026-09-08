import mongoose from 'mongoose';

const admissionSchema = new mongoose.Schema(
  {
    applicationNumber: { type: String, required: true, unique: true },
    enquiryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enquiry' },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
    applicationDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'], default: 'PENDING' },
    documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
    remarks: String,
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date
  },
  { timestamps: true }
);

export default mongoose.model('Admission', admissionSchema);
