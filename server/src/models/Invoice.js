import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    studentFeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentFee' },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    items: [{
      description: String,
      quantity: { type: Number, default: 1 },
      amount: { type: Number, min: 0 }
    }],
    subtotal: { type: Number, min: 0 },
    discount: { type: Number, min: 0, default: 0 },
    totalAmount: { type: Number, min: 0 },
    status: { type: String, enum: ['DRAFT', 'ISSUED', 'CANCELLED'], default: 'ISSUED' },
    invoiceDate: { type: Date, default: Date.now },
    pdfUrl: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Invoice', invoiceSchema);
