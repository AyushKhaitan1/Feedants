const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'Dance',
    },
    tags: [
      {
        type: String,
      },
    ],
    prizePool: {
      type: Number,
      required: true,
      min: 0,
    },
    entryFee: {
      type: Number,
      required: true,
      min: 0,
    },
    maxSpots: {
      type: Number,
      required: true,
      default: 20,
    },
    spotsBooked: {
      type: Number,
      default: 1,
      min: 0,
    },
    judge: {
      name: { type: String, required: true },
      role: { type: String, default: 'Judge' },
      designation: { type: String, required: true },
      experience: { type: String, required: true },
      avatarUrl: { type: String },
      introVideoUrl: { type: String },
      bio: { type: String },
    },
    dates: {
      registrationClosesAt: { type: Date, required: true },
      registerBefore: {
        dateStr: { type: String, default: '10 Aug 26' },
        timeStr: { type: String, default: '11:50 PM' },
        timestamp: { type: Date },
      },
      submissionStarts: {
        dateStr: { type: String, default: '6 Aug 26' },
        timeStr: { type: String, default: '04:00 AM' },
        timestamp: { type: Date },
      },
      submissionEnds: {
        dateStr: { type: String, default: '30 Aug 26' },
        timeStr: { type: String, default: '11:55 PM' },
        timestamp: { type: Date },
      },
      resultDate: {
        dateStr: { type: String, default: '1 Sept 26' },
        timeStr: { type: String, default: '11:50 PM' },
        timestamp: { type: Date },
      },
    },
    previousWinners: [
      {
        name: { type: String, required: true },
        position: { type: String, required: true },
        avatarUrl: { type: String },
        videoUrl: { type: String },
        style: { type: String },
      },
    ],
    tabs: {
      about: {
        shortEn: { type: String },
        fullEn: { type: String },
        shortHi: { type: String },
        fullHi: { type: String },
      },
      judgingParameters: [
        {
          title: { type: String, required: true },
          weight: { type: String, required: true },
          description: { type: String },
        },
      ],
      rulesAndEligibility: [
        {
          type: String,
        },
      ],
    },
    rewards: [
      {
        rank: { type: Number, required: true },
        title: { type: String, required: true },
        amount: { type: Number, required: true },
        iconType: { type: String, default: 'trophy' },
      },
    ],
    disclaimer: {
      type: String,
      default: 'Only contributions from paid participants will be considered for judging.',
    },
    referral: {
      bonusPerSignup: { type: Number, default: 10 },
      slug: { type: String, default: 'referral123' },
    },
    status: {
      type: String,
      enum: ['REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'SUBMISSION_OPEN', 'SUBMISSION_CLOSED', 'RESULTS_DECLARED'],
      default: 'REGISTRATION_OPEN',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for remaining spots
competitionSchema.virtual('remainingSpots').get(function () {
  return Math.max(0, this.maxSpots - this.spotsBooked);
});

// Virtual for isSoldOut
competitionSchema.virtual('isSoldOut').get(function () {
  return this.spotsBooked >= this.maxSpots;
});

// Virtual for isRegistrationClosed
competitionSchema.virtual('isRegistrationClosed').get(function () {
  if (this.status === 'REGISTRATION_CLOSED') return true;
  if (this.dates && this.dates.registrationClosesAt) {
    return new Date() > new Date(this.dates.registrationClosesAt);
  }
  return false;
});

module.exports = mongoose.model('Competition', competitionSchema);
