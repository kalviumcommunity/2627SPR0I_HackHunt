
# HackHunt – Find the Right Hackathon Before the Deadline

## Getting Started

HackHunt is a centralized platform that helps students discover hackathons and student opportunities before their deadlines. See [Run locally with Docker Compose](#run-locally-with-docker-compose) for setup instructions.

# HackHunt
### Find the right hackathon before the deadline.

## 1. Problem Statement

Students often learn about suitable hackathons after registration deadlines have passed because information is scattered across messages and different platforms. HackHunt solves this problem by providing a centralized, curated opportunity board where coordinators can add hackathon details, including official links, eligibility criteria, deadlines, and last-checked dates. Students can browse and filter current opportunities to find relevant hackathons before it is too late. Listings are stored persistently so that records remain available after application restarts.

The platform does not require automated scraping or personalized AI recommendations.

The service-baseline action uses the existing coordinator workflow from the [product requirements](docs/PRD.md): after verifying an opportunity on its official site, the coordinator re-checks its listing. The existing last-checked date is updated in PostgreSQL, and each successful re-check is recorded durably in the same database.

## 2. Team Details

- **Team Number:** 01
- **Sprint Focus:** DevOps

### Team Members
- Issac Antony
- Sera Shine

## 3. Tech Stack

- **Frontend:** React
- **Backend:** Node.js and Express.js
- **Database:** PostgreSQL
- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **Deployment:** Render

## 4. Features

### Student Features
- View current hackathon and opportunity listings.
- Search and filter opportunities by mode, type, and deadline.
- Sort opportunities by nearest deadline.
- View official links, eligibility requirements, deadlines, and last-checked dates.
- Identify opportunities closing soon or containing stale information.
- Open official opportunity links.
- Create a student account and sign in securely.

### Coordinator Features
- Log in to manage opportunities.
- Add, edit, delete, and archive listings.
- Re-check opportunity details and update the last-checked date.
- Validate required fields before saving changes.

### Data and DevOps
- Store opportunity records and coordinator re-check history persistently in PostgreSQL so they survive app restarts.
- Store student accounts in PostgreSQL with bcrypt-hashed passwords.
- Build and run the existing application with Docker Compose.
- Automate testing and builds using GitHub Actions.
- Deploy the application using Render.

## Run locally with Docker Compose

### Prerequisites
- Docker Desktop with its engine running

### Configure

From the repository root, create the ignored Compose environment file:

```powershell
Copy-Item .env.example .env
```

Set a local PostgreSQL password in `POSTGRES_PASSWORD` and the matching `DATABASE_URL`. Set a coordinator username, password hash, and long random `COORDINATOR_JWT_SECRET`. Generate a password hash from the backend folder:

```powershell
cd backend
npm run hash-password -- "your-coordinator-password"
cd ..
```

Copy the printed hash into `COORDINATOR_PASSWORD_HASH` in the root `.env`, keeping it single-quoted so Compose does not expand the `$` characters in the hash. The example values are for local setup only; do not commit `.env`.

### Install, migrate, and start

The Docker build installs backend dependencies. Start the app and its PostgreSQL database:

```powershell
docker compose up -d --build
docker compose exec app npm run db:migrate
```

The app also applies this idempotent migration automatically at startup. PostgreSQL data is stored in the `postgres_data` named volume. To seed the opportunity board:

```powershell
docker compose exec app npm run seed
```

The API listens on port 5000. To install backend dependencies outside Docker, run `npm ci --prefix backend`. For that mode, configure `DATABASE_URL` in `backend/.env` with `localhost` as the database host; PostgreSQL must already be running. Start the database from the repository root with `docker compose up -d postgres`. Docker Desktop must be running, and the root `.env` must be configured as described above. The Compose service hostname `postgres` is only for connections from containers, not from Node running directly on Windows.

### Student accounts

The app applies the users-table migration automatically at startup. Student signup stores a bcrypt hash in PostgreSQL, rejects duplicate email addresses, and redirects to student sign-in after registration. Sign-in sets an HTTP-only `studentToken` cookie. Student auth uses the existing `COORDINATOR_JWT_SECRET`; no additional secret is required.

```http
POST /api/signup
Content-Type: application/json

{"fullName":"Ada Lovelace","email":"ada@example.com","password":"choose-a-password"}
```

```http
POST /api/student/login
Content-Type: application/json

{"email":"ada@example.com","password":"choose-a-password"}
```

### Coordinator re-check API

The existing coordinator-authenticated endpoint performs the incident-related business action:

```http
PUT /api/admin/opportunities/:id/recheck
```

It updates `lastChecked` in PostgreSQL and inserts the opportunity ID, checked date, and event timestamp into the `opportunity_rechecks` table. Invalid IDs return `400`, missing opportunities return `404`, unauthenticated callers return `401`, and PostgreSQL persistence failures return `503`.

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

Run the backend tests against the Compose PostgreSQL test database in PowerShell:

```powershell
docker compose exec postgres createdb -U hackhunt hackhunt_test
$env:TEST_DATABASE_URL = "postgresql://hackhunt:your-local-password@127.0.0.1:5432/hackhunt_test"
npm test --prefix backend
Remove-Item Env:TEST_DATABASE_URL
```

Without `TEST_DATABASE_URL`, the tests run against an in-memory PostgreSQL instance. The helper only accepts a database name ending in `_test`.

To start the existing frontend, run `npm install --prefix frontend` and then `npm run dev --prefix frontend` from the repository root.

To confirm PostgreSQL history, run:

```powershell
docker compose exec postgres psql -U hackhunt -d hackhunt -c "SELECT opportunity_id, last_checked, rechecked_at FROM opportunity_rechecks ORDER BY id DESC LIMIT 5;"
```

To verify data survives an app restart, run `docker compose restart app`, then repeat the API request or SQL query. To stop the containers without deleting persistent records, run `docker compose down` (do not add `-v`).

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

HackHunt focuses on manually curated hackathon opportunities. Automated scraping, personalized AI recommendations, email or SMS alerts, in-app registration for listed opportunities, and a separate mobile application are outside the scope of this sprint.
