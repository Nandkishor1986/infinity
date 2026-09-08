import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    expenseNumber: { type: String, unique: true, sparse: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    description: String,
    expenseDate: { type: Date, default: Date.now },
    paymentMethod: String,
    receiptUrl: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Expense', expenseSchema);
