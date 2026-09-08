import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['EMAIL', 'SMS', 'WHATSAPP'], required: true },
    subject: String,
    content: { type: String, required: true },
    variables: [String],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('MessageTemplate', schema);
