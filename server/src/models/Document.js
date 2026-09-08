import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    ownerType: { type: String, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    category: String,
    fileName: String,
    fileUrl: String,
    mimeType: String,
    size: Number,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export default mongoose.model('Document', schema);
