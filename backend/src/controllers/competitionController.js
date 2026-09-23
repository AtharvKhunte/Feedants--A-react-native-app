const Competition = require('../models/Competition');
const Registration = require('../models/Registration');
const { getUserCompetitionState } = require('../utils/competitionState');
const cache = require('../utils/cache');

// GET /api/competitions/:id
exports.getCompetition = async (req, res, next) => {
  try {
    const cacheKey = `competition:${req.params.id}`;
    let competition = cache.get(cacheKey);

    if (!competition) {
      competition = await Competition.findById(req.params.id);
      if (!competition) return res.status(404).json({ success: false, message: 'Competition not found' });
      cache.set(cacheKey, competition, 60);
    }

    let registration = null;
    if (req.user) {
      registration = await Registration.findOne({
        userId: req.user._id,
        competitionId: competition._id,
      });
    }

    const userState = getUserCompetitionState(competition, registration);
    const spotsLeft = competition.totalSpots - competition.bookedSpots;

    res.json({
      success: true,
      data: {
        competition,
        userState,
        isRegistered: !!(registration && registration.paymentStatus === 'completed'),
        spotsLeft,
        hasSubmitted: registration ? !!registration.submissionUrl : false,
      },
    });
  } catch (err) { next(err); }
};

// GET /api/competitions
exports.listCompetitions = async (req, res, next) => {
  try {
    const cacheKey = 'competitions:list';
    let competitions = cache.get(cacheKey);

    if (!competitions) {
      competitions = await Competition.find().select(
        'title tags category prizePool entryFee totalSpots bookedSpots registrationCloseDate status'
      );
      cache.set(cacheKey, competitions, 120); // cache 2 minutes
    }

    res.json({ success: true, data: competitions });
  } catch (err) { next(err); }
};

// POST /api/competitions/:id/register
exports.registerForCompetition = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const existing = await Registration.findOne({ userId, competitionId: id });
    if (existing && existing.paymentStatus === 'completed') {
      return res.status(409).json({ success: false, message: 'Already registered' });
    }

    const updated = await Competition.findOneAndUpdate(
      { _id: id, $expr: { $lt: ['$bookedSpots', '$totalSpots'] } },
      { $inc: { bookedSpots: 1 } },
      { new: true }
    );

    if (!updated) {
      const comp = await Competition.findById(id);
      if (!comp) return res.status(404).json({ success: false, message: 'Competition not found' });
      return res.status(409).json({ success: false, message: 'No spots available' });
    }

    if (updated.status !== 'registration_open') {
      await Competition.findByIdAndUpdate(id, { $inc: { bookedSpots: -1 } });
      return res.status(400).json({ success: false, message: 'Registration not open' });
    }

    // Invalidate cache so next fetch reflects new bookedSpots
    cache.del(`competition:${id}`);
    cache.del('competitions:list');

    const registration = await Registration.findOneAndUpdate(
      { userId, competitionId: id },
      { paymentStatus: 'completed', paymentId: req.body.paymentId || 'SIMULATED_' + Date.now() },
      { upsert: true, new: true }
    );

    const userState = getUserCompetitionState(updated, registration);
    res.status(201).json({ success: true, data: { registration, userState } });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Already registered' });
    }
    next(err);
  }
};

// POST /api/competitions/:id/submit
exports.submitEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { submissionUrl } = req.body;
    if (!submissionUrl) return res.status(400).json({ success: false, message: 'submissionUrl required' });

    const competition = cache.get(`competition:${id}`) || await Competition.findById(id);
    if (!competition) return res.status(404).json({ success: false, message: 'Not found' });
    if (competition.status !== 'submission_open') {
      return res.status(400).json({ success: false, message: 'Submission window not open' });
    }

    const registration = await Registration.findOneAndUpdate(
      { userId: req.user._id, competitionId: id, paymentStatus: 'completed', submissionUrl: null },
      { submissionUrl, submittedAt: new Date() },
      { new: true }
    );

    if (!registration) {
      return res.status(400).json({ success: false, message: 'Not registered or already submitted' });
    }

    res.json({ success: true, data: registration });
  } catch (err) { next(err); }
};