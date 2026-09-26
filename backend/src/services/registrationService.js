const Competition = require('../models/Competition');
const Registration = require('../models/Registration');
const User = require('../models/User');

/**
 * Concurrency-Safe Registration Service
 * 
 * Handles race conditions and high concurrent load using atomic conditional updates.
 * Guarantees:
 * 1. Zero overbooking even if thousands of concurrent requests arrive simultaneously.
 * 2. Idempotency and duplicate registration prevention via MongoDB compound unique index.
 * 3. Automatic rollback compensation if document insertion fails.
 */
class RegistrationService {
  /**
   * Register a user for a competition with strict atomic concurrency control
   */
  async registerUserForCompetition({ competitionId, userId, paymentDetails = {} }) {
    // Step 1: Pre-flight user validation
    const user = await User.findById(userId);
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    // Step 2: Check if user is already registered (fast-path rejection)
    const existingRegistration = await Registration.findOne({
      competition: competitionId,
      user: userId,
      status: 'REGISTERED',
    });

    if (existingRegistration) {
      throw {
        status: 409,
        message: 'You have already registered for this competition.',
        code: 'ALREADY_REGISTERED',
        registration: existingRegistration,
      };
    }

    // Step 3: Fetch competition to verify lifecycle and entry fee
    const compCheck = await Competition.findById(competitionId);
    if (!compCheck) {
      throw { status: 404, message: 'Competition not found' };
    }

    // Lifecycle check
    const now = new Date();
    if (compCheck.dates && compCheck.dates.registrationClosesAt && now > new Date(compCheck.dates.registrationClosesAt)) {
      throw {
        status: 400,
        message: 'Registration for this competition has officially closed.',
        code: 'REGISTRATION_CLOSED',
      };
    }

    // Step 4: ATOMIC CONDITIONAL UPDATE TO RESERVE SPOT
    // This is the core concurrency lock:
    // Only succeeds if spotsBooked is strictly less than maxSpots at the exact moment of execution in MongoDB engine.
    const reservedCompetition = await Competition.findOneAndUpdate(
      {
        _id: competitionId,
        $expr: { $lt: ['$spotsBooked', '$maxSpots'] },
        status: { $in: ['REGISTRATION_OPEN', 'UPCOMING'] },
      },
      {
        $inc: { spotsBooked: 1 },
      },
      {
        returnDocument: 'after',
      }
    );

    if (!reservedCompetition) {
      // Re-read competition to give exact diagnostic
      const latestComp = await Competition.findById(competitionId);
      if (latestComp && latestComp.spotsBooked >= latestComp.maxSpots) {
        throw {
          status: 409,
          message: 'All spots are currently booked! The competition is full.',
          code: 'SPOTS_FULL',
        };
      }
      throw {
        status: 400,
        message: 'Competition is currently not accepting registrations.',
        code: 'REGISTRATION_UNAVAILABLE',
      };
    }

    // Slot number assigned to this user
    const assignedSlot = reservedCompetition.spotsBooked;

    // Step 5: Create Registration Record
    try {
      const registration = await Registration.create({
        competition: competitionId,
        user: userId,
        slotNumber: assignedSlot,
        status: 'REGISTERED',
        payment: {
          amountPaid: reservedCompetition.entryFee,
          paymentId: paymentDetails.paymentId || `pay_rzp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          orderId: paymentDetails.orderId || `order_${Date.now()}`,
          currency: 'INR',
          method: paymentDetails.method || 'UPI',
          status: 'SUCCESS',
          paidAt: new Date(),
        },
      });

      return {
        success: true,
        message: 'Registration successful!',
        registration,
        competition: {
          _id: reservedCompetition._id,
          title: reservedCompetition.title,
          spotsBooked: reservedCompetition.spotsBooked,
          maxSpots: reservedCompetition.maxSpots,
          remainingSpots: Math.max(0, reservedCompetition.maxSpots - reservedCompetition.spotsBooked),
        },
      };
    } catch (createErr) {
      // Step 6: COMPENSATING ROLLBACK
      // If creating the registration document failed (e.g. duplicate key race), release the reserved spot!
      await Competition.updateOne(
        { _id: competitionId },
        { $inc: { spotsBooked: -1 } }
      );

      if (createErr.code === 11000) {
        throw {
          status: 409,
          message: 'You have already registered for this competition.',
          code: 'ALREADY_REGISTERED',
        };
      }
      throw createErr;
    }
  }

  /**
   * Reset spots (Utility for testing & simulation)
   */
  async resetCompetitionSpots(competitionId, spotsBooked = 1) {
    const comp = await Competition.findByIdAndUpdate(
      competitionId,
      { spotsBooked },
      { new: true }
    );
    // Optionally clean registrations
    return comp;
  }
}

module.exports = new RegistrationService();
