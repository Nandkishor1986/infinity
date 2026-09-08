import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
    employeeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: String,
    email: String,
    specialization: [String],
    joiningDate: Date,
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' }
  },
  { timestamps: true }
);

export default mongoose.model('Teacher', teacherSchema);
