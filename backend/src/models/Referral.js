const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referrerId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  refereeId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  competitionId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Competition' },
  discountAmount: { type: Number, default: 10 },
  status:         { type: String, enum: ['pending', 'credited'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Referral', referralSchema);