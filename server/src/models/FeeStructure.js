import mongoose from 'mongoose';

const feeStructureSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    name: { type: String, required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    installments: [{
      name: String,
      amount: { type: Number, min: 0 },
      dueAfterDays: { type: Number, min: 0 }
    }],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('FeeStructure', feeStructureSchema);
