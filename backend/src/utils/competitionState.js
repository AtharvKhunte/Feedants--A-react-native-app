// Returns the user-facing CTA and state label for a competition
exports.getUserCompetitionState = (competition, registration) => {
  const status = competition.status;
  const isRegistered = registration && registration.paymentStatus === 'completed';
  const spotsLeft = competition.totalSpots - competition.bookedSpots;

  if (status === 'upcoming') {
    return { cta: 'Coming Soon', ctaEnabled: false, stateLabel: 'upcoming' };
  }

  if (status === 'registration_open') {
    if (isRegistered) {
      return { cta: 'Registered', ctaEnabled: false, stateLabel: 'registered' };
    }
    if (spotsLeft <= 0) {
      return { cta: 'Spots Full', ctaEnabled: false, stateLabel: 'spots_full' };
    }
    return { cta: 'Register Now', ctaEnabled: true, stateLabel: 'can_register' };
  }

  if (status === 'submission_open') {
    if (isRegistered) {
      const submitted = registration.submissionUrl !== null;
      return {
        cta: submitted ? 'Submission Uploaded' : 'Upload Submission',
        ctaEnabled: !submitted,
        stateLabel: submitted ? 'submitted' : 'can_submit',
      };
    }
    return { cta: 'Registration Closed', ctaEnabled: false, stateLabel: 'reg_closed' };
  }

  if (status === 'closed') {
    return { cta: 'Results Awaited', ctaEnabled: false, stateLabel: 'awaiting_result' };
  }

  if (status === 'result_announced') {
    return { cta: 'View Results', ctaEnabled: true, stateLabel: 'result_announced' };
  }

  return { cta: '', ctaEnabled: false, stateLabel: '' };
};