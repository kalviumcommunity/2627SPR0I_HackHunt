function dateOffsetFromToday(offset) {
  const date = new Date()
  date.setUTCHours(12, 0, 0, 0)
  date.setUTCDate(date.getUTCDate() + offset)
  return date.toISOString().slice(0, 10)
}

function dateOffsetFromTodayAgo(daysAgo) {
  return dateOffsetFromToday(-daysAgo)
}

export const opportunities = [
  {
    id: 'build-for-tomorrow',
    title: 'Build for Tomorrow Hackathon',
    organizer: 'Northstar Labs',
    officialUrl: 'https://example.com/build-for-tomorrow',
    type: 'hackathon',
    mode: 'hybrid',
    eligibilityNotes: 'Open to university students in teams of 2–5.',
    deadline: dateOffsetFromToday(2),
    lastChecked: dateOffsetFromTodayAgo(2),
    status: 'active',
  },
  {
    id: 'open-source-sprint',
    title: 'Open Source Impact Sprint',
    organizer: 'Code Commons',
    officialUrl: 'https://example.com/open-source-sprint',
    type: 'contest',
    mode: 'online',
    eligibilityNotes: 'All students are welcome; submit an open-source project.',
    deadline: dateOffsetFromToday(5),
    lastChecked: dateOffsetFromTodayAgo(10),
    status: 'active',
  },
  {
    id: 'green-tech-challenge',
    title: 'Green Tech Challenge',
    organizer: 'Future Earth Network',
    officialUrl: 'https://example.com/green-tech-challenge',
    type: 'hackathon',
    mode: 'offline',
    eligibilityNotes: 'For undergraduate teams building climate solutions.',
    deadline: dateOffsetFromToday(7),
    lastChecked: dateOffsetFromTodayAgo(3),
    status: 'active',
  },
  {
    id: 'emerging-builders-fellowship',
    title: 'Emerging Builders Fellowship',
    organizer: 'Foundry Collective',
    officialUrl: 'https://example.com/builders-fellowship',
    type: 'fellowship',
    mode: 'online',
    eligibilityNotes: 'Undergraduate and graduate students with a project idea.',
    deadline: dateOffsetFromToday(10),
    lastChecked: dateOffsetFromTodayAgo(12),
    status: 'active',
  },
  {
    id: 'campus-innovation-cup',
    title: 'Campus Innovation Cup',
    organizer: 'Innovation League',
    officialUrl: 'https://example.com/innovation-cup',
    type: 'contest',
    mode: 'hybrid',
    eligibilityNotes: 'Teams must include at least one currently enrolled student.',
    deadline: dateOffsetFromToday(14),
    lastChecked: dateOffsetFromTodayAgo(8),
    status: 'active',
  },
  {
    id: 'digital-access-design',
    title: 'Digital Access Design Jam',
    organizer: 'Better Web Initiative',
    officialUrl: 'https://example.com/access-design-jam',
    type: 'other',
    mode: 'online',
    eligibilityNotes: 'Open to students interested in accessible product design.',
    deadline: dateOffsetFromToday(21),
    lastChecked: dateOffsetFromTodayAgo(1),
    status: 'active',
  },
]
