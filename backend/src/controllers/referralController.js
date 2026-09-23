const User = require('../models/User');
const Referral = require('../models/Referral');

// GET /api/referrals/link/:competitionId
exports.getReferralLink = async (req, res) => {
  const { competitionId } = req.params;
  const user = req.user;
  const link = `https://feedants.com/r/${user.referralCode}?competition=${competitionId}`;
  res.json({ success: true, data: { link, referralCode: user.referralCode } });
};

// POST /api/referrals/apply
exports.applyReferral = async (req, res, next) => {
  try {
    const { referralCode, competitionId } = req.body;
    const referee = req.user;

    const referrer = await User.findOne({ referralCode });
    if (!referrer) return res.status(404).json({ success: false, message: 'Invalid referral code' });
    if (referrer._id.equals(referee._id)) {
      return res.status(400).json({ success: false, message: 'Cannot use own referral code' });
    }

    const existing = await Referral.findOne({ refereeId: referee._id, competitionId });
    if (existing) return res.status(409).json({ success: false, message: 'Referral already applied' });

    const referral = await Referral.create({
      referrerId: referrer._id,
      refereeId: referee._id,
      competitionId,
      status: 'credited',
    });

    res.json({ success: true, data: referral, discountAmount: referral.discountAmount });
  } catch (err) { next(err); }
};