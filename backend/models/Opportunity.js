const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    organizer: { type: String, required: true, trim: true },
    officialUrl: {
      type: String,
      required: true,
      trim: true,
      match: /^https?:\/\//i
    },
    type: {
      type: String,
      enum: ['hackathon', 'contest', 'fellowship', 'other']
    },
    mode: {
      type: String,
      enum: ['online', 'offline', 'hybrid']
    },
    eligibilityNotes: { type: String, required: true, trim: true },
    deadline: { type: Date, required: true },
    lastChecked: {
      type: Date,
      required: true,
      validate: {
        validator: (date) => date <= new Date(),
        message: 'lastChecked cannot be in the future'
      }
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Opportunity', opportunitySchema);
