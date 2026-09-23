const router = require('express').Router();
const { getReferralLink, applyReferral } = require('../controllers/referralController');
const { protect } = require('../middleware/auth');

router.get('/link/:competitionId', protect, getReferralLink);
router.post('/apply',              protect, applyReferral);

module.exports = router;