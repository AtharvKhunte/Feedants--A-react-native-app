const router = require('express').Router();
const { getCompetition, listCompetitions, registerForCompetition, submitEntry } =
  require('../controllers/competitionController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/',           optionalAuth, listCompetitions);
router.get('/:id',        optionalAuth, getCompetition);
router.post('/:id/register', protect,  registerForCompetition);
router.post('/:id/submit',   protect,  submitEntry);

module.exports = router;