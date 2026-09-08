import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    courseCode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: String,
    duration: {
      value: Number,
      unit: { type: String, enum: ['DAYS', 'MONTHS', 'YEARS'] }
    },
    totalFees: { type: Number, min: 0, default: 0 },
    syllabus: [String],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);
