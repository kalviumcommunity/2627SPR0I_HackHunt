# Project: HackHunt (Opportunity Board)


A website where students find current hackathons and opportunities. A coordinator enters official links, eligibility notes, deadlines and last-checked dates. Students filter current listings. Records must survive restarts. No scraping and no AI recommendations.


## Stack
Frontend: React (Vite) in /frontend
Backend: Node.js + Express + Mongoose in /backend
Database: MongoDB (local Docker container; MongoDB Atlas when deployed)
DevOps: Docker, docker-compose, GitHub Actions, Render
Tests: Jest + Supertest
## Opportunity fields
title, organizer, officialUrl (http/https only), type (hackathon, contest, fellowship, other), mode (online, offline, hybrid), eligibilityNotes, deadline (date), lastChecked (date, never in the future), status (active, archived), createdAt, updatedAt. All of title, organizer, officialUrl, eligibilityNotes, deadline and lastChecked are required.


## Business rules
current = deadline is today or later and status is active
closing soon = 7 days or less remain
stale = lastChecked is more than 7 days ago
Students see only current listings by default, sorted by nearest deadline
## API
GET /api/opportunities (public; filters: mode, type, window in days, q search) and GET /api/opportunities/:id
POST /api/login, POST /api/logout
POST, PUT, DELETE /api/admin/opportunities (coordinator only)
GET /health
## Rules for all code
Keep code simple, with short comments. No extra features.
Never hardcode secrets. Use environment variables and keep .env.example up to date.
Validate all input on the server. Use parameterised queries and safe output.

Add or update tests for every feature.