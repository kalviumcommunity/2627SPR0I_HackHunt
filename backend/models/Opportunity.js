const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    organizer: { type: String, required: true, trim: true },
    officialUrl: {
      type: String,
      required: true,
      validate: {
        validator: (value) => /^https?:\/\/\S+$/i.test(value),
        message: 'officialUrl must use HTTP or HTTPS',
      },
    },
    type: {
      type: String,
      required: true,
      enum: ['hackathon', 'contest', 'fellowship', 'other'],
    },
    mode: { type: String, required: true, enum: ['online', 'offline', 'hybrid'] },
    eligibilityNotes: { type: String, required: true },
    deadline: { type: Date, required: true },
    lastChecked: { type: Date, required: true },
    status: { type: String, required: true, enum: ['active', 'archived'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Opportunity
  || mongoose.model('Opportunity', opportunitySchema);
