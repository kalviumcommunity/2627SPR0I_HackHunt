require('dotenv').config();

const mongoose = require('mongoose');
const Opportunity = require('./models/Opportunity');
const { startOfToday } = require('./utils/dates');

function addDays(date, days) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function buildSeedOpportunities(now = new Date()) {
  const today = startOfToday(now);
  const sampleData = [
    {
      title: 'Campus Innovators Hackathon',
      organizer: 'Northstar Labs',
      slug: 'campus-innovators-hackathon',
      type: 'hackathon',
      mode: 'hybrid',
      eligibilityNotes: 'Open to university students in teams of two to five.',
      deadlineDays: 12,
      checkedDaysAgo: 1,
    },
    {
      title: 'Open Source Impact Challenge',
      organizer: 'Civic Code Collective',
      slug: 'open-source-impact-challenge',
      type: 'contest',
      mode: 'online',
      eligibilityNotes: 'Students may submit an individual open-source project.',
      deadlineDays: 6,
      checkedDaysAgo: 9,
    },
    {
      title: 'Emerging Founders Fellowship',
      organizer: 'Launchpad Foundation',
      slug: 'emerging-founders-fellowship',
      type: 'fellowship',
      mode: 'online',
      eligibilityNotes: 'For current students exploring an early-stage venture.',
      deadlineDays: 24,
      checkedDaysAgo: 2,
    },
    {
      title: 'Green City Data Sprint',
      organizer: 'Urban Futures Network',
      slug: 'green-city-data-sprint',
      type: 'hackathon',
      mode: 'offline',
      eligibilityNotes: 'Undergraduate teams are welcome; bring a laptop.',
      deadlineDays: 2,
      checkedDaysAgo: 0,
    },
    {
      title: 'Student Design Systems Prize',
      organizer: 'Pixel Foundry',
      slug: 'student-design-systems-prize',
      type: 'contest',
      mode: 'online',
      eligibilityNotes: 'Open to students with a prototype or design case study.',
      deadlineDays: 18,
      checkedDaysAgo: 3,
    },
    {
      title: 'Applied AI Research Internship',
      organizer: 'Meridian Research Group',
      slug: 'applied-ai-research-internship',
      type: 'other',
      mode: 'hybrid',
      eligibilityNotes: 'Applicants should be enrolled in a degree program.',
      deadlineDays: 35,
      checkedDaysAgo: 1,
    },
    {
      title: 'Community Tech Fellowship',
      organizer: 'Common Good Studio',
      slug: 'community-tech-fellowship',
      type: 'fellowship',
      mode: 'offline',
      eligibilityNotes: 'Open to students interested in civic technology.',
      deadlineDays: 45,
      checkedDaysAgo: 4,
    },
    {
      title: 'Autumn Robotics Challenge',
      organizer: 'Copperfield Robotics',
      slug: 'autumn-robotics-challenge',
      type: 'hackathon',
      mode: 'hybrid',
      eligibilityNotes: 'Student teams can compete remotely or at a local venue.',
      deadlineDays: -3,
      checkedDaysAgo: 2,
    },
  ];

  return sampleData.map((sample) => ({
    title: sample.title,
    organizer: sample.organizer,
    officialUrl: `https://example.com/opportunities/${sample.slug}`,
    type: sample.type,
    mode: sample.mode,
    eligibilityNotes: sample.eligibilityNotes,
    deadline: addDays(today, sample.deadlineDays),
    lastChecked: addDays(today, -sample.checkedDaysAgo),
    status: 'active',
  }));
}

async function seed(now = new Date()) {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI or MONGO_URI must be set');
  }

  await mongoose.connect(mongoUri);
  try {
    await Opportunity.deleteMany({});
    return await Opportunity.insertMany(buildSeedOpportunities(now));
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  seed()
    .then((opportunities) => {
      console.log(`Seeded ${opportunities.length} opportunities`);
    })
    .catch((error) => {
      console.error('Failed to seed opportunities', error);
      process.exitCode = 1;
    });
}

module.exports = { buildSeedOpportunities, seed };
