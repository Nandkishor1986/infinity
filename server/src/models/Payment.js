import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    receiptNumber: { type: String, required: true, unique: true },
    studentFeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentFee', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    amount: { type: Number, required: true, min: 0.01 },
    paymentMethod: { type: String, enum: ['CASH', 'UPI', 'BANK_TRANSFER', 'CARD', 'ONLINE', 'OTHER'], required: true },
    transactionId: String,
    paymentDate: { type: Date, default: Date.now },
    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    notes: String
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);
