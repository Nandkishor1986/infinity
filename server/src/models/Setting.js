import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    instituteName: { type: String, default: 'Infinity Computer Institute' },
    logo: String,
    address: String,
    phone: String,
    email: String,
    website: String,
    invoicePrefix: { type: String, default: 'ICI-INV' },
    studentIdPrefix: { type: String, default: 'ICI-STU' },
    certificatePrefix: { type: String, default: 'ICI-CERT' },
    currency: { type: String, default: 'INR' },
    notificationSettings: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      whatsapp: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

export default mongoose.model('Setting', schema);
