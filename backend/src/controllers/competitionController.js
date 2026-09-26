const Competition = require('../models/Competition');
const Registration = require('../models/Registration');
const Submission = require('../models/Submission');

/**
 * Get details for a competition with user-specific contextual state
 */
exports.getCompetitionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId || req.headers['x-user-id'];

    let competition;
    if (id && id !== 'featured' && id !== 'latest') {
      competition = await Competition.findById(id);
    } else {
      competition = await Competition.findOne({ isActive: true }).sort({ createdAt: -1 });
    }

    if (!competition) {
      return res.status(404).json({ success: false, message: 'Competition not found' });
    }

    // Dynamic lifecycle calculations
    const now = new Date();
    const registrationClosesAt = new Date(competition.dates.registrationClosesAt);
    const submissionStarts = competition.dates.submissionStarts.timestamp
      ? new Date(competition.dates.submissionStarts.timestamp)
      : new Date('2026-08-06T04:00:00.000Z');
    const submissionEnds = competition.dates.submissionEnds.timestamp
      ? new Date(competition.dates.submissionEnds.timestamp)
      : new Date('2026-08-30T23:55:00.000Z');

    const isRegistrationExpired = now > registrationClosesAt;
    const isSpotsFull = competition.spotsBooked >= competition.maxSpots;
    const remainingSpots = Math.max(0, competition.maxSpots - competition.spotsBooked);

    // Calculate countdown milliseconds
    const countdownMs = Math.max(0, registrationClosesAt.getTime() - now.getTime());

    // Check user registration state if userId provided
    let isUserRegistered = false;
    let userRegistration = null;
    let userSubmission = null;

    if (userId) {
      userRegistration = await Registration.findOne({
        competition: competition._id,
        user: userId,
        status: 'REGISTERED',
      });

      if (userRegistration) {
        isUserRegistered = true;
        userSubmission = await Submission.findOne({
          competition: competition._id,
          user: userId,
        });
      }
    }

    // Determine current user action button state
    let actionState = 'CAN_REGISTER';
    let actionLabelEn = `Register Now • ₹${competition.entryFee}`;
    let actionLabelHi = `अभी रजिस्टर करें • ₹${competition.entryFee}`;
    let actionSubtext = `Only ${remainingSpots} spots left`;

    if (isUserRegistered) {
      if (userSubmission) {
        actionState = 'SUBMISSION_COMPLETED';
        actionLabelEn = 'Submission Uploaded';
        actionLabelHi = 'प्रविष्टि अपलोड हो गई';
        actionSubtext = 'View your submission details';
      } else {
        actionState = 'CAN_SUBMIT';
        actionLabelEn = 'Upload Submission';
        actionLabelHi = 'प्रविष्टि अपलोड करें';
        actionSubtext = 'Registered';
      }
    } else if (isSpotsFull) {
      actionState = 'SPOTS_FULL';
      actionLabelEn = 'Spots Full';
      actionLabelHi = 'सीटें भर चुकी हैं';
      actionSubtext = `${competition.maxSpots}/${competition.maxSpots} Booked`;
    } else if (isRegistrationExpired || competition.status === 'REGISTRATION_CLOSED') {
      actionState = 'REGISTRATION_CLOSED';
      actionLabelEn = 'Registration Closed';
      actionLabelHi = 'पंजीकरण बंद है';
      actionSubtext = 'Next edition opening soon';
    }

    return res.status(200).json({
      success: true,
      data: {
        ...competition.toObject(),
        remainingSpots,
        isSpotsFull,
        isRegistrationExpired,
        countdownMs,
        userContext: {
          userId: userId || null,
          isRegistered: isUserRegistered,
          registration: userRegistration,
          submission: userSubmission,
          actionState,
          actionLabelEn,
          actionLabelHi,
          actionSubtext,
        },
      },
    });
  } catch (error) {
    console.error('Error in getCompetitionDetails:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * List all competitions
 */
exports.getAllCompetitions = async (req, res) => {
  try {
    const competitions = await Competition.find({ isActive: true }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: competitions.length, data: competitions });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Update competition parameters / lifecycle state (for testing & admin preview)
 */
exports.updateCompetitionState = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await Competition.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Competition not found' });
    }

    return res.status(200).json({ success: true, message: 'Competition updated', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Reset competition spots & demo data
 */
exports.resetCompetition = async (req, res) => {
  try {
    const { id } = req.params;
    const { spotsBooked = 1, clearRegistrations = false } = req.body;

    const competition = await Competition.findByIdAndUpdate(
      id,
      { spotsBooked, status: 'REGISTRATION_OPEN' },
      { new: true }
    );

    if (clearRegistrations) {
      await Registration.deleteMany({ competition: id });
      await Submission.deleteMany({ competition: id });
    }

    return res.status(200).json({
      success: true,
      message: 'Competition reset successfully',
      data: competition,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
