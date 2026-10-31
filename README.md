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

## 5. Setup, Run and Test Instructions

### Prerequisites
- Git
- Docker Desktop with Docker Compose
- Node.js and npm (for local development without Docker)
- MongoDB Atlas or another configured MongoDB instance, if required by the application setup

### Clone the Repository

```bash
git clone https://github.com/KalviumCommunity/<REPOSITORY_NAME>.git
cd <REPOSITORY_NAME>
```

Replace `<REPOSITORY_NAME>` with the actual repository name.

### Configure Environment Variables

Create the required environment configuration using `.env.example` as a reference. Set the database connection, authentication secrets, and any other variables required by the application.

Never commit real credentials or secrets.

### Run with Docker Compose

```bash
docker compose up --build
```

Open the frontend URL and port configured in the project.

To stop the application:

```bash
docker compose down
```

Do not remove persistent database volumes when stopping the application if you need to retain local database records.

### Run Tests

Run the automated tests using the scripts configured in the frontend and backend `package.json` files.

Verify that:
- Search, filters, and deadline sorting work correctly.
- Expired listings are hidden by default.
- Required fields are validated.
- Coordinator authentication prevents unauthorized modifications.
- Adding, editing, deleting, and archiving listings work correctly.
- Data remains available after restarting the application.
- Docker builds successfully.
- GitHub Actions tests and builds pass.

Replace these instructions with the exact test commands configured in the repository.

## 6. Environment Variables

The following table must be completed using the actual environment variables used by the application.

| Variable Name | Purpose |
|---|---|
| `<DATABASE_URI_VARIABLE>` | MongoDB connection string |
| `<AUTH_SECRET_VARIABLE>` | Authentication or session security, if applicable |
| `<OTHER_VARIABLES>` | Other required application configuration |

Refer to `.env.example` for the complete list of required variable names. Do not commit passwords, API keys, database credentials, or other secrets.

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

