import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    attachmentUrl: String,
    targetType: { type: String, enum: ['ALL', 'COURSE', 'BATCH', 'STUDENT'], default: 'ALL' },
    targetId: mongoose.Schema.Types.ObjectId,
    publishDate: { type: Date, default: Date.now },
    expiryDate: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPublished: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('Notice', schema);
