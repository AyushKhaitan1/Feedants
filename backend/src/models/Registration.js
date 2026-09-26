const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competition',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['REGISTERED', 'CANCELLED', 'REFUNDED'],
      default: 'REGISTERED',
    },
    slotNumber: {
      type: Number,
      required: true,
    },
    payment: {
      paymentId: { type: String, default: () => `pay_rzp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}` },
      orderId: { type: String, default: () => `order_${Date.now()}` },
      amountPaid: { type: Number, required: true },
      currency: { type: String, default: 'INR' },
      method: { type: String, default: 'UPI' },
      status: { type: String, enum: ['SUCCESS', 'PENDING', 'FAILED'], default: 'SUCCESS' },
      paidAt: { type: Date, default: Date.now },
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: guarantees user cannot register multiple times for same competition
registrationSchema.index({ competition: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
