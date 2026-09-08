import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recipient: { type: String, required: true },
    channel: { type: String, enum: ['EMAIL', 'SMS', 'WHATSAPP'], required: true },
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'MessageTemplate' },
    subject: String,
    message: String,
    status: { type: String, enum: ['QUEUED', 'SENT', 'DELIVERED', 'FAILED'], default: 'QUEUED' },
    providerMessageId: String,
    sentAt: Date,
    deliveredAt: Date,
    failedAt: Date,
    errorMessage: String
  },
  { timestamps: true }
);

export default mongoose.model('MessageLog', schema);
