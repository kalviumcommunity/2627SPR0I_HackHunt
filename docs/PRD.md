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

Right now, finding a hackathon depends on luck. A student has to be in the right group at the right time, and has to trust a forwarded message that may be old or wrong. Our Opportunity Board fixes this by putting all current opportunities in one place, checked by a coordinator, with tools to find the right one quickly.

**How the board solves each problem from 1.1 and 1.2**

| Problem today | How the Opportunity Board solves it | How students benefit |
|---|---|---|
| Details are spread over many chat groups, so students miss them. | **One central board.** The coordinator adds every opportunity in one place. Students open one website instead of searching many chats. | Students do not need to be in every group. Nobody misses an opportunity just because they did not see a message. |
| Messages get buried under new messages. | **A saved list sorted by nearest deadline.** Listings stay on the board until the deadline passes, and the ones closing first are shown first. Cards show "Closing soon" when 7 days or less remain. | Students can see what is urgent at a glance and apply before the last date. |
| Students cannot filter by what they are eligible for. | **Search and filters** by mode (online or offline), type and deadline. Each card also shows the eligibility notes. | Students quickly find opportunities that fit them and do not waste time on events they cannot join. |
| Links may not be official, so students cannot trust them. | **Official links only.** The coordinator must add the official link for every listing, and the button opens the real registration page. | Students apply on the genuine site and avoid fake or wrong links. |
| No one knows if the details are still correct. | **Last-checked date and warning tags.** Every listing shows when it was last verified. If it was not checked for more than 7 days, it shows a "Stale" tag. The coordinator can click "Re-checked" after verifying. | Students know how fresh the information is and can double-check the official site if a listing is stale. |
| Expired events keep circulating in chats. | **Automatic hiding of expired listings.** Listings whose deadline has passed are not shown by default. | Students only see opportunities they can still apply for, so their time is not wasted. |
| Data and details are lost or forgotten. | **Saved records.** All listings are stored in a database and stay safe after the app restarts. | The board is a reliable source that students can check again and again. |

**Overall benefit for students**

- **Save time:** one page, quick filters and search, instead of scrolling through chat history.
- **Do not miss deadlines:** the nearest deadlines come first, with "Closing soon" warnings.
- **Find relevant opportunities:** eligibility notes and filters show what suits them.
- **Trust the information:** official links and last-checked dates show the details are real and recent.
- **Fair access:** every student gets the same information at the same time, whether or not they are in a particular group.

The coordinator also benefits. They add each opportunity once and no longer need to post the same message again and again or answer repeated questions about dates and eligibility.

---

## 2. Users and Stakeholders

### 2.1 Target users: students

The main users are **college students** who want to join hackathons, coding contests and similar opportunities.

- **Who:** students from all departments and all years (1st year to final year) of our college.
- **Why all years:** first-year students can start early. Final-year students can find opportunities before they graduate.
- **What they need:** a quick way to see current opportunities, check if they are eligible, and reach the official registration page before the deadline.
- **Technical skill:** no special skill is needed. They only need a phone or laptop with internet.
- **Login:** students do not need an account. The board is open to read for everyone.

### 2.2 Coordinator and verifier

- **Who the coordinator is:** one nominated person who manages the board. This can be a staff member of the innovation cell or a trusted student leader of a club. The faculty advisor will confirm the name.
- **Who verifies the details:** the coordinator is also the verifier. Before adding a listing, the coordinator checks the details on the official website of the organizer. If the coordinator is busy, a second person nominated by the advisor can act as a backup.
- **How verification works:**
  - Check that the link is the official one.
  - Check the last date and the eligibility rules on the official page.
  - Enter the details on the board and set the last-checked date.
  - Click "Re-checked" after checking again, so the date stays fresh.
- **Login:** only the coordinator (and the backup) will have a login to add, edit, archive or delete listings.

### 2.3 Faculty / club advisors

Faculty or club advisors do not use the board every day. They review and approve the solution.

- **What they review:**
  - This PRD, to confirm that the problem and the plan are right.
  - The working website during the final demo.
  - The rules for the board: only official links, and listings must be re-checked within 7 days.
- **What they approve:**
  - That the project can go live for students.
  - Who the coordinator (and backup) will be.
  - What kinds of opportunities can be listed.
- **After launch:** they can check now and then that the board is up to date.

### 2.4 College / innovation cell

The college and the innovation cell do not use the platform directly, but they benefit from it.

- **More participation:** when more students hear about opportunities in time, more of them take part in hackathons and contests.
- **Better results:** more participation can lead to more projects, wins and recognition for the college.
- **One official channel:** the innovation cell gets one trusted place to share opportunities, instead of many scattered messages.
- **Less manual work:** the cell does not need to repeat announcements or answer the same questions again and again.
- **Useful record:** the board shows which opportunities were shared and when.

### 2.5 Development team

Issac, Sera and Joshua build and deploy the website in this sprint. They are not users after the project is handed over, but they are responsible for making sure it works. Their roles are listed in section 7.1.

### 2.6 Summary of roles and responsibilities

| Who | Role | Responsibility | What they gain |
|---|---|---|---|
| Students | Main users | View, search and filter listings. Open the official link and apply before the deadline. | Find relevant opportunities on time and stop missing deadlines. |
| Coordinator | Admin user | Add listings from official sources, verify details, update the last-checked date, edit, archive or delete old listings. | Saves time. No more posting the same message again and again. |
| Backup coordinator | Admin user (backup) | Do the coordinator's work when the coordinator is not available. | The board stays up to date at all times. |
| Faculty / club advisors | Approvers | Review the PRD and the final demo, approve the project, and confirm who the coordinator is. | Confidence that the information is accurate and official. |
| College / innovation cell | Beneficiary | Support the board and share it with students. | Higher student participation and one trusted channel. |
| Issac, Sera, Joshua | Development team | Build, test and deploy the website. | A working project delivered in this sprint. |

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

Each measure below has a **target** and a clear way to **verify** it.

#### 1. Complete listings (100%)

- **Target:** every listing has an official link, eligibility notes, last date and last-checked date.
- **How we verify:**
  - The database requires all four fields, so a listing cannot be saved without them.
  - The API checks the input. It must reject a listing if a field is empty, if the link is not a valid `http` or `https` URL, or if the last-checked date is in the future.
  - An automated API test (Jest and Supertest) sends listings with a missing field and checks that each one is rejected.
  - Before the demo, we run a database query that counts listings with an empty mandatory field. The count must be 0.

#### 2. Expired listings are hidden (0 shown)

- **Target:** no expired listing appears on the student page by default.
- **How we verify:**
  - A unit test checks the date rule. A listing with yesterday's date is not current. A listing with today's date or a later date is current.
  - An API test adds listings with a past date and a future date, calls the public list endpoint, and checks that the past one is not returned.
  - A manual check on the student page: add a listing with a past date and confirm it does not show.

#### 3. Data stays after restart or redeploy (100%)

- **Target:** all records are still there after the app restarts or is deployed again.
- **How we verify:**
  - **Restart test on our computers:** add 5 test listings and note the count. Run `docker compose down` and then `docker compose up`. The count and the content must be the same. We repeat this after rebuilding the images with `docker compose up --build`.
  - **Redeploy test on Render:** add a listing on the live site, deploy a new version, and check that the listing is still there. This works because the data is stored in MongoDB, not inside the app container.
  - The result of both tests is written in the test log with the date.

#### 4. Student finds a listing in under 30 seconds

- **Target:** a student finds a suitable listing in under 30 seconds.
- **How we verify:**
  - We run a simple usability test with 3 to 5 students who have not seen the website before.
  - Each student gets one task, for example: "Find an online hackathon that closes within 30 days and open its official link."
  - We time each student with a stopwatch from opening the page to clicking the official link.
  - The target is met if the average time is under 30 seconds and no student takes more than 60 seconds.
  - We note any step where students got stuck and fix it.

#### 5. Coordinator adds a listing in under 2 minutes

- **Target:** the coordinator adds a complete listing in under 2 minutes.
- **How we verify:**
  - The coordinator (or a team member playing that role) logs in and adds 3 different listings from real official pages, using a stopwatch.
  - Time starts when the "Add listing" form opens and ends when the listing shows on the student page.
  - The target is met if each listing takes under 2 minutes, and the average is under 2 minutes.
  - If the form is slow or confusing, we improve it, for example with clearer labels and a date picker.

#### 6. Automatic tests pass and the app starts with one command

- **Target:** the automatic tests pass in GitHub Actions and the whole app starts with `docker compose up`.
- **How we verify:**
  - GitHub Actions runs on every push and pull request. A change can only be merged and deployed if every check is green.
  - **These automated checks must pass before deployment:**
    1. **Lint check:** the code has no style or syntax errors.
    2. **Date rule tests:** current, "Closing soon" (7 days or less) and "Stale" (not checked for over 7 days) are calculated correctly.
    3. **Input validation tests:** listings with a missing field, a wrong link or a future last-checked date are rejected.
    4. **API tests:** the public list and filter endpoints work, login works, and add, edit and delete work only after login.
    5. **Access test:** add, edit and delete return an "unauthorized" error when the user is not logged in.
    6. **Docker build check:** the Docker image builds without errors.
    7. **Health check:** after the app starts, the `/health` endpoint responds with OK.
  - **One-command start:** a team member who did not write the Docker setup clones the repository on a clean computer, copies `.env.example` to `.env`, and runs `docker compose up`. The site must open and show the sample listings.

#### Summary

| Measure | Target | Verified by |
|---|---|---|
| Complete listings | 100% | Database and API checks, automated tests, database count query |
| Expired listings hidden | 0 shown | Unit test, API test, manual check |
| Data after restart or redeploy | 100% kept | Docker restart test, Render redeploy test |
| Student search time | Under 30 seconds | Timed test with 3 to 5 students |
| Coordinator entry time | Under 2 minutes | Timed test with 3 real listings |
| Tests and start-up | All checks green, one command | GitHub Actions, clean-computer run |

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