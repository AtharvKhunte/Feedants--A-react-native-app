const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  competitionId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Competition', required: true },
  paymentStatus:  { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  paymentId:      { type: String, default: null },    // Razorpay payment ID
  submissionUrl:  { type: String, default: null },
  submittedAt:    { type: Date, default: null },
  appliedReferralCode: { type: String, default: null },
}, { timestamps: true });

// Prevent duplicate registration
registrationSchema.index({ userId: 1, competitionId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);