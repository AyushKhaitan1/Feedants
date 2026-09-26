const registrationService = require('../services/registrationService');
const Registration = require('../models/Registration');
const User = require('../models/User');
const Competition = require('../models/Competition');

/**
 * Register user for a competition
 */
exports.register = async (req, res) => {
  try {
    const { competitionId, userId, paymentDetails } = req.body;

    if (!competitionId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Both competitionId and userId are required.',
      });
    }

    const result = await registrationService.registerUserForCompetition({
      competitionId,
      userId,
      paymentDetails,
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error('Registration failed:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Registration failed',
      code: error.code || 'REGISTRATION_ERROR',
      registration: error.registration || null,
    });
  }
};

/**
 * Get registration details for a user & competition
 */
exports.getUserRegistration = async (req, res) => {
  try {
    const { competitionId, userId } = req.params;

    const registration = await Registration.findOne({
      competition: competitionId,
      user: userId,
    }).populate('user', 'name email phone avatarUrl');

    if (!registration) {
      return res.status(404).json({
        success: false,
        isRegistered: false,
        message: 'No registration found for this user in this competition.',
      });
    }

    return res.status(200).json({
      success: true,
      isRegistered: true,
      data: registration,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Concurrency Stress-Test Demonstration Endpoint
 * Simulates N concurrent users attempting to claim limited spots at the same millisecond!
 */
exports.simulateConcurrentRegistrations = async (req, res) => {
  try {
    const { competitionId, simulatedUsersCount = 10 } = req.body;

    const competition = await Competition.findById(competitionId);
    if (!competition) {
      return res.status(404).json({ success: false, message: 'Competition not found' });
    }

    // Find or create test users
    const testUsers = [];
    for (let i = 1; i <= simulatedUsersCount; i++) {
      let u = await User.findOne({ email: `stress_user_${i}@example.com` });
      if (!u) {
        u = await User.create({
          name: `Stress Tester ${i}`,
          email: `stress_user_${i}@example.com`,
          phone: `987654321${i % 10}`,
        });
      }
      testUsers.push(u);
    }

    // Fire all registration promises concurrently via Promise.allSettled
    const startTime = Date.now();
    const attempts = testUsers.map((user) =>
      registrationService.registerUserForCompetition({
        competitionId,
        userId: user._id,
        paymentDetails: {
          method: 'CONCURRENT_TEST',
          amountPaid: competition.entryFee,
        },
      })
    );

    const results = await Promise.allSettled(attempts);
    const durationMs = Date.now() - startTime;

    const successful = results.filter((r) => r.status === 'fulfilled').map((r) => r.value);
    const rejected = results.filter((r) => r.status === 'rejected').map((r) => r.reason);

    // Fetch refreshed competition state to verify no overbooking
    const refreshedComp = await Competition.findById(competitionId);

    return res.status(200).json({
      success: true,
      message: 'Concurrency test completed',
      durationMs,
      simulatedRequests: simulatedUsersCount,
      successfulCount: successful.length,
      rejectedCount: rejected.length,
      finalSpotsBooked: refreshedComp.spotsBooked,
      maxSpotsAllowed: refreshedComp.maxSpots,
      overbookingOccurred: refreshedComp.spotsBooked > refreshedComp.maxSpots,
      rejectionSummary: rejected.map((e) => e.message || e),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
