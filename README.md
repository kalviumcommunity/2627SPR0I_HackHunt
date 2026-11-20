
# HackHunt – Find the Right Hackathon Before the Deadline

## Getting Started

HackHunt is a centralized platform that helps students discover hackathons and student opportunities before their deadlines. See [Run locally with Docker](#run-locally-with-docker) for setup instructions.

# HackHunt
### Find the right hackathon before the deadline.

## 1. Problem Statement

Students often learn about suitable hackathons after registration deadlines have passed because information is scattered across messages and different platforms. HackHunt solves this problem by providing a centralized, curated opportunity board where coordinators can add hackathon details, including official links, eligibility criteria, deadlines, and last-checked dates. Students can browse and filter current opportunities to find relevant hackathons before it is too late. Listings are stored persistently so that records remain available after application restarts.

The platform does not require automated scraping or personalized AI recommendations.

After verifying an opportunity on its official site, the coordinator re-checks its listing. The last-checked date is updated in MongoDB.

## 2. Team Details

- **Team Number:** 01
- **Sprint Focus:** DevOps

### Team Members
- Issac Antony
- Sera Shine

## 3. Tech Stack

- **Frontend:** React
- **Backend:** Node.js and Express.js
- **Database:** MongoDB with Mongoose
- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **Deployment:** Render
- **Database Hosting:** MongoDB Atlas

## 4. Features

### Student Features
- View current hackathon and opportunity listings.
- Search and filter opportunities by mode, type, and deadline.
- Sort opportunities by nearest deadline.
- View official links, eligibility requirements, deadlines, and last-checked dates.
- Identify opportunities closing soon or containing stale information.
- Open official opportunity links.

### Coordinator Features
- Log in to manage opportunities.
- Add, edit, delete, and archive listings.
- Re-check opportunity details and update the last-checked date.
- Validate required fields before saving changes.

### Data and DevOps
- Store opportunity records persistently in MongoDB.
- Build and run the existing application with Docker Compose.
- Automate testing and builds using GitHub Actions.
- Deploy the application using Render.

## Run locally with Docker

### Prerequisites
- Docker Desktop with its engine running

### Build and start

Build the backend image from the repository root:

```powershell
docker build -t hackhunt-backend ./backend
```

Start MongoDB and the backend on the same Docker network:

```powershell
docker network create hackhunt-net; docker run -d --name mongo --network hackhunt-net mongo:7; docker run --rm --network hackhunt-net -p 5000:5000 -e PORT=5000 -e MONGODB_URI="mongodb://mongo:27017/hackhunt" hackhunt-backend
```

To enable coordinator login, also provide `JWT_SECRET`, `COORDINATOR_USERNAME`, and `COORDINATOR_PASSWORD_HASH` to the backend container. Example values in `.env.example` are placeholders; do not commit `.env`.

For persistent local MongoDB data, copy `.env.example` to `.env` and use Docker Compose:

```powershell
docker compose up -d --build
docker compose exec app npm run seed
```

The Compose setup uses `mongo:7` with the `mongo_data` named volume. The API listens on port 5000. To install backend dependencies outside Docker, run `npm ci --prefix backend` and configure `MONGODB_URI` in `backend/.env`; MongoDB must be running.

### Coordinator re-check API

The existing coordinator-authenticated endpoint performs the incident-related business action:

```http
PUT /api/admin/opportunities/:id/recheck
```

It updates `lastChecked` in MongoDB. Invalid IDs return `400`, missing opportunities return `404`, and unauthenticated callers return `401`.

Example (after setting up a coordinator account and replacing the ID with an opportunity ID). The login file is written as UTF-8 without a BOM before `curl.exe` sends it:

```powershell
$loginFile = Join-Path $env:TEMP 'hackhunt-login.json'
[System.IO.File]::WriteAllText($loginFile, '{"username":"coordinator","password":"your-coordinator-password"}', [System.Text.UTF8Encoding]::new($false))
curl.exe -c cookies.txt -H 'Content-Type: application/json' --data-binary "@$loginFile" http://localhost:5000/api/login
curl.exe -b cookies.txt http://localhost:5000/api/admin/opportunities
curl.exe -i -b cookies.txt -X PUT http://localhost:5000/api/admin/opportunities/0123456789abcdef01234567/recheck
```

Example successful response:

```json
{
 "_id": "0123456789abcdef01234567",
 "title": "Student Hackathon",
 "organizer": "Example University",
 "officialUrl": "https://example.edu/hackathon",
 "type": "hackathon",
 "mode": "online",
 "eligibilityNotes": "Open to all students",
 "deadline": "2027-01-01T00:00:00.000Z",
 "lastChecked": "2026-11-18T00:00:00.000Z",
 "status": "active"
}
```

Run the backend tests in PowerShell:

```powershell
npm test --prefix backend
```

Tests use `mongodb-memory-server` and do not require a separate database.

To start the existing frontend, run `npm install --prefix frontend` and then `npm run dev --prefix frontend` from the repository root.

To verify data survives an app restart, run `docker compose restart app`, then repeat the API request. To stop the containers without deleting persistent records, run `docker compose down` (do not add `-v`).

## 7. Demo Link

**Live Demo:** [Deployed URL]

The demo should demonstrate:
1. A student searching and filtering current opportunities.
2. A coordinator logging in and adding an opportunity.
3. The new listing appearing on the student board.
4. The listing remaining available after an application restart.

## 8. Project Board

**Project Board:** [Project Board URL]

The project board tracks development tasks, team responsibilities, testing, deployment, and documentation.

## 9. Scope and Limitations

HackHunt focuses on manually curated hackathon opportunities. Automated scraping, personalized AI recommendations, student accounts, email or SMS alerts, in-app registration, and a separate mobile application are outside the scope of this sprint.

## Dependency pinning

Backend packages are locked in `backend/package-lock.json` and installed with `npm ci`. The Docker base image uses an exact tag. See [dependency pinning](docs/dependency-pinning.md).
