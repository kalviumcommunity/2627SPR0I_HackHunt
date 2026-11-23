CREATE TABLE IF NOT EXISTS opportunities (
  id CHAR(24) PRIMARY KEY,
  title TEXT NOT NULL,
  organizer TEXT NOT NULL,
  official_url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('hackathon', 'contest', 'fellowship', 'other')),
  mode TEXT NOT NULL CHECK (mode IN ('online', 'offline', 'hybrid')),
  eligibility_notes TEXT NOT NULL,
  deadline DATE NOT NULL,
  last_checked DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS opportunities_status_deadline_idx
  ON opportunities (status, deadline);
