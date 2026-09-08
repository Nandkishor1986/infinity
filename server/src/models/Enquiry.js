import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    enquiryNumber: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    source: { type: String, enum: ['WEBSITE', 'WALK_IN', 'PHONE', 'WHATSAPP', 'REFERRAL', 'OTHER'], default: 'WEBSITE' },
    message: String,
    status: { type: String, enum: ['NEW', 'CONTACTED', 'FOLLOW_UP', 'CONVERTED', 'NOT_INTERESTED', 'CLOSED'], default: 'NEW' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    followUpDate: Date,
    notes: String
  },
  { timestamps: true }
);

export default mongoose.model('Enquiry', enquirySchema);
