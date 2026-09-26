const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competition',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    registration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Registration',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    danceForm: {
      type: String,
      default: 'Kathak',
    },
    mediaUrl: {
      type: String,
      required: true,
      trim: true,
    },
    mediaType: {
      type: String,
      enum: ['video/mp4', 'video/quicktime', 'youtube_link', 'drive_link'],
      default: 'video/mp4',
    },
    durationSeconds: {
      type: Number,
      default: 180,
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['SUBMITTED', 'UNDER_REVIEW', 'EVALUATED', 'REJECTED'],
      default: 'SUBMITTED',
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    judgeFeedback: {
      type: String,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// One active submission per user per competition
submissionSchema.index({ competition: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
