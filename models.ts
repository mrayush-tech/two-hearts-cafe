import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  guests: { type: Number, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  message: { type: String },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
  paymentId: { type: String },
  orderId: { type: String },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

export const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
