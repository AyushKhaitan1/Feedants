const Submission = require('../models/Submission');
const Registration = require('../models/Registration');
const Competition = require('../models/Competition');

/**
 * Submit an entry for the competition
 */
exports.createSubmission = async (req, res) => {
  try {
    const { competitionId, userId, title, danceForm, mediaUrl, notes } = req.body;

    if (!competitionId || !userId || !title || !mediaUrl) {
      return res.status(400).json({
        success: false,
        message: 'competitionId, userId, title, and mediaUrl are required.',
      });
    }

    // Step 1: Verify user is registered
    const registration = await Registration.findOne({
      competition: competitionId,
      user: userId,
      status: 'REGISTERED',
    });

    if (!registration) {
      return res.status(403).json({
        success: false,
        message: 'You must be registered for this competition before submitting your entry.',
        code: 'NOT_REGISTERED',
      });
    }

    // Step 2: Check if already submitted
    const existingSubmission = await Submission.findOne({
      competition: competitionId,
      user: userId,
    });

    if (existingSubmission) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted your performance for this competition.',
        code: 'ALREADY_SUBMITTED',
        submission: existingSubmission,
      });
    }

    // Step 3: Check submission lifecycle dates
    const competition = await Competition.findById(competitionId);
    if (!competition) {
      return res.status(404).json({ success: false, message: 'Competition not found' });
    }

    // Create submission record
    const submission = await Submission.create({
      competition: competitionId,
      user: userId,
      registration: registration._id,
      title,
      danceForm: danceForm || 'Classical Dance',
      mediaUrl,
      notes: notes || '',
      status: 'SUBMITTED',
      submittedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: 'Submission uploaded successfully! Our judges will review your performance.',
      data: submission,
    });
  } catch (error) {
    console.error('Error in createSubmission:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get user submission status
 */
exports.getUserSubmission = async (req, res) => {
  try {
    const { competitionId, userId } = req.params;

    const submission = await Submission.findOne({
      competition: competitionId,
      user: userId,
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        hasSubmitted: false,
        message: 'No submission found.',
      });
    }

    return res.status(200).json({
      success: true,
      hasSubmitted: true,
      data: submission,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
