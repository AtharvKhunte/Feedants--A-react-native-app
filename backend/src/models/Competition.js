const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  position:    { type: Number, required: true },
  label:       { type: String, required: true }, // "1st Winner"
  amount:      { type: Number, required: true },
}, { _id: false });

const winnerSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name:        { type: String },
  position:    { type: Number },
  videoUrl:    { type: String },
  photoUrl:    { type: String },
}, { _id: false });

const judgeSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  photoUrl:     { type: String },
  credentials:  { type: String },
  experience:   { type: String },
  introVideoUrl:{ type: String },
}, { _id: false });

const competitionSchema = new mongoose.Schema({
  title:              { type: String, required: true },
  tags:               [{ type: String }],            // ["Dance", "Multi-Win"]
  category:           { type: String, required: true },
  prizePool:          { type: Number, required: true },
  entryFee:           { type: Number, required: true },
  totalSpots:         { type: Number, required: true },
  bookedSpots:        { type: Number, default: 0 },
  judge:              judgeSchema,
  rewards:            [rewardSchema],
  winners:            [winnerSchema],
  registrationOpenDate:   { type: Date, required: true },
  registrationCloseDate:  { type: Date, required: true },
  submissionStartDate:    { type: Date, required: true },
  submissionEndDate:      { type: Date, required: true },
  resultDate:             { type: Date, required: true },
  about:              { type: String },
  judgingParameters:  { type: String },
  rulesAndEligibility:{ type: String },
  winnersGetCertificate: { type: Boolean, default: false },
  referralDiscountAmount: { type: Number, default: 10 },
}, { timestamps: true });

// Virtual: compute status from dates
competitionSchema.virtual('status').get(function () {
  const now = new Date();
  if (now < this.registrationOpenDate) return 'upcoming';
  if (now >= this.registrationOpenDate && now <= this.registrationCloseDate) return 'registration_open';
  if (now > this.registrationCloseDate && now <= this.submissionEndDate) return 'submission_open';
  if (now > this.submissionEndDate && now < this.resultDate) return 'closed';
  return 'result_announced';
});

competitionSchema.set('toJSON', { virtuals: true });
competitionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Competition', competitionSchema);