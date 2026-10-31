# Product Requirements Document (PRD)

| | |
|---|---|
| **Project** | A website where students find current hackathons and opportunities |
| **Sprint focus** | DevOps |
| **Team members** | Issac, Sera, Joshua |

---

## 1. Problem and Context

### 1.1 The real-world problem

Students hear about hackathons only after the last date is over. The details are spread over many chat groups and messages, so many students miss good chances.

### 1.2 How people handle it now

- People forward messages in WhatsApp and Telegram groups.
- Messages get buried, and links may not be official.
- No one knows if the details are still correct or when they were last checked.
- Students cannot filter by what they are eligible for.

### 1.3 Why a better solution is needed

One board that shows the official link, who can apply, the last date and the date it was last checked. Students see everything in one place and in time. The data is saved, so it is a trusted source and not just another chat.

---

## 2. Users and Stakeholders

| Who | Role | What they do or gain |
|---|---|---|
| Students | User and beneficiary | Use the board, filter current listings, and stop missing deadlines. No login needed. |
| Coordinator | User (admin) | Adds, edits and removes listings after login. Saves time answering repeated questions. |
| Faculty / club advisors | Approver | Review and approve the solution. |
| College / innovation cell | Beneficiary | Gains from more student participation. |

---

## 3. Objectives and Success Measures

### 3.1 What we want to achieve

- One place for all current listings.
- Every listing can be trusted: official link, eligibility, last date and last-checked date.
- Easy filters for students.
- Data is not lost when the app restarts.
- The app is easy to deploy and test (DevOps).

### 3.2 How we will measure success

- **Complete listings:** every listing has a link, eligibility, last date and last-checked date. Target: 100%.
- **Expired listings:** none shown by default. Target: 0.
- **Data after restart:** all records are still there. Target: 100%.
- **Student search time:** a student finds a listing in under 30 seconds.
- **Coordinator entry time:** the coordinator adds a listing in under 2 minutes.
- **Tests and start-up:** automatic tests pass and the app starts with one command.

---

## 4. Project Scope

### 4.1 Features we will build in this sprint

- **Student page:** listing cards, filters (mode, type, last date), search, sort by nearest date, and warning tags.
- **Coordinator page:** login, add, edit, delete, archive, and a Re-checked button.
- **Backend and database:** API, input checks, data saved safely, backup.
- **DevOps:** Docker, automatic tests and build (GitHub Actions), deployment, README.

### 4.2 What we will NOT include

Automatic scraping, AI recommendations, student accounts, email or SMS alerts, in-app registration, and a mobile app.

### 4.3 Simple rules

- A listing is **current** if its last date is today or later.
- It shows **Closing soon** if 7 days or less remain.
- It shows **Stale** if it was not checked for over 7 days.

---

## 5. User Stories and Acceptance Criteria

| As a... | I want to... | So that... | It works when (acceptance criteria) |
|---|---|---|---|
| Student | see all current listings | I do not miss a deadline | Expired listings are hidden. The nearest date comes first. |
| Student | filter and search | I find the right event fast | Filters and search work together and the list updates. |
| Student | see who can apply and the dates | I know if I am eligible | Each card shows eligibility, last date and last-checked date. |
| Student | open the official link | I apply on the real site | The link opens the official site in a new tab. |
| Coordinator | log in safely | only I can change data | Wrong password is rejected. Data cannot be changed without login. |
| Coordinator | add a listing | students can see it | The form will not save if a field is missing. The listing shows on the board at once. |
| Coordinator | edit, delete or archive | the board stays correct | Changes save. Delete asks to confirm. Archived listings are hidden. |
| Coordinator | keep my data | I never type it again | All records are still there after restart. |

---

## 6. Feasibility and Dependencies

### 6.1 Technology stack

| Part | Technology |
|---|---|
| Frontend | React |
| Backend | Node.js with Express |
| Database | MongoDB |
| DevOps | Docker and GitHub Actions. Deployed on Render |

### 6.2 Required data and APIs

No outside API is needed. The coordinator types in the data from official sites. Each listing has: title, organizer, official link, type, mode, eligibility notes, last date and last-checked date. Our own API has: list and filter (public), login, add / edit / delete (coordinator only), and a health check.

### 6.3 Technical limitations

- Data is added by hand, so it must be kept up to date.
- MongoDB is more than enough for a small board, but the free Atlas plan has a small storage limit.
- The free Render plan can go to sleep when not used, so the first page load may be slow. Data is safe because it is stored in MongoDB, not on Render.
- The team is only three people, so we keep the scope small.

### 6.4 Security and privacy

- No student data is collected.
- Passwords are stored in hashed form. Secrets are kept in environment variables, not in the code.
- Only the coordinator can change data. All inputs are checked.
- Regular backups of the database.

---

## 7. Delivery and Validation Plan

### 7.1 Team responsibilities

| Team member | Area | Work |
|---|---|---|
| Sera | Frontend | Student page, cards, filters and search, warning tags, coordinator login page and forms, connect all pages to the API. |
| Issac | Backend and Database | API, login, input checks, security, health check. MongoDB collections, saved storage, sample data and backup. |
| Joshua | DevOps, Testing and Docs | Docker and settings, GitHub Actions pipeline, deployment, API and UI tests, user testing, README and demo guide. |

### 7.2 Task deadlines

| Deadline | Issac | Sera | Joshua |
|---|---|---|---|
| Week 1 | Set up backend. Design MongoDB collections. Build add, edit, delete API. | Page wireframes. Set up frontend. Student page layout and cards. | Set up repository and branches. Write Dockerfile. Start GitHub Actions. |
| Week 2 | Login, filter queries, security checks, sample data, backup. | Filters, search and badges. Coordinator pages connected to the API. | Docker with MongoDB volume. Automatic tests and build. API tests. |
| Week 3 | Fix bugs. Restore test. Final settings. | Fix bugs. Final design checks on phone and laptop. | Deploy online. User testing. README and demo practice. |

### 7.3 Testing plan

- Test the date rules and input checks.
- Test the API: filters, login, add, edit and delete.
- Restart the app and check that the data is still saved.
- Try the site on a phone and a laptop.
- Let 3 to 5 students and the coordinator try it, and check every acceptance criterion.

### 7.4 Deployment

The app runs in Docker containers (React, Express and MongoDB) with a saved data volume. Anyone can start it with `docker compose up`. The Docker image is deployed online on Render after GitHub Actions tests pass, and it connects to MongoDB Atlas so data is kept.

### 7.5 Demo

A student filters the listings. The coordinator adds a new one. It shows on the board. We restart the app and the data is still there.