
# HackHunt – Find the Right Hackathon Before the Deadline

## Getting Started

HackHunt is a centralized platform that helps students discover hackathons and student opportunities before their deadlines. See [How to run](#how-to-run) for setup instructions.

## Assigned Incident

This repository setup and documentation task is tracked under:

[Issue #5 – Initial Team Workflow Setup](https://github.com/kalviumcommunity/2627SPR0I_HackHunt/issues/5)




# HackHunt
### Find the right hackathon before the deadline.

## 1. Problem Statement

Students often learn about suitable hackathons after registration deadlines have passed because information is scattered across messages and different platforms. HackHunt solves this problem by providing a centralized, curated opportunity board where coordinators can add hackathon details, including official links, eligibility criteria, deadlines, and last-checked dates. Students can browse and filter current opportunities to find relevant hackathons before it is too late. Listings are stored persistently so that records remain available after application restarts.

The platform does not require automated scraping or personalized AI recommendations.

## 2. Team Details

- **Team Number:** 01
- **Sprint Focus:** DevOps

### Team Members
- Issac Antony
- Sera Shine

## 3. Tech Stack

- **Frontend:** React
- **Backend:** Node.js and Express.js
- **Database:** MongoDB
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
- Preserve records after application restarts.
- Run the application using Docker Compose.
- Automate testing and builds using GitHub Actions.
- Deploy the application using Render.

## How to run

### Prerequisites
- Node.js and npm
- A MongoDB Atlas connection string

### Configure the backend

From the repository root, enter the backend folder and create the environment file:

```bash
cd backend
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

Edit the copied `.env` file and set `MONGODB_URI` to your MongoDB Atlas connection string. Set a coordinator username and a long random `COORDINATOR_JWT_SECRET`.

Create a password hash and copy the printed value into `COORDINATOR_PASSWORD_HASH` in `.env`:

```bash
npm run hash-password -- "your-coordinator-password"
```

Install backend dependencies and seed the database:

```bash
npm install
npm run seed
```

Start the backend from the `backend` folder:

```bash
npm run dev
```

### Start the frontend

In a second terminal, from the repository root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite. Its development proxy forwards `/api` requests to the backend.

### Run the backend tests

From the `backend` folder:

```bash
npm test
```

Do not commit `.env` or other files containing credentials.

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

