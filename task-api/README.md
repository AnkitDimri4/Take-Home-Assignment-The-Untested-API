# Task API – Take‑Home Assignment

This is my solution for the **“The Untested API”** take‑home assignment for the Full Stack Developer Intern position at Underpin Services.[web:10]

The project is a small Task Manager API built with **Node.js** and **Express**, using an in‑memory data store and tested with **Jest** and **Supertest**.[web:1][web:10]

---

## Getting started

**Prerequisites:** Node.js 18+

```bash
cd task-api
npm install
npm start        # runs on http://localhost:3000
```

**Tests:**

```bash
npm test         # run test suite
npm run coverage # run tests with coverage report
```

---

## API overview

The main endpoints exposed by the API are:[web:10]

- `GET /tasks` – list all tasks, with optional `?status=`, `?page=`, `?limit=` query parameters  
- `POST /tasks` – create a new task  
- `PUT /tasks/:id` – full update of a task  
- `DELETE /tasks/:id` – delete a task (returns 204 on success)  
- `PATCH /tasks/:id/complete` – mark a task as complete  
- `GET /tasks/stats` – return counts by status and overdue tasks  
- `PATCH /tasks/:id/assign` – **assign a task to a user** (implemented in this solution)[web:1][web:10]

Task objects follow the shape described in the original assignment (`id`, `title`, `description`, `status`, `priority`, `dueDate`, `completedAt`, `createdAt`).[web:10]

---

## Implementation notes

- **Business logic and storage:** `src/services/taskService.js`  
- **HTTP routes:** `src/routes/tasks.js`  
- **Validation helpers:** `src/utils/validators.js`  
- **App setup / middleware:** `src/app.js`  
- **Tests:** under `tests/services` and `tests/routes`  

I focused on:

- Adding **unit tests** for the service layer and **integration tests** for the routes.  
- Achieving **>90% coverage** to comfortably exceed the 80% target.  
- Implementing the new `PATCH /tasks/:id/assign` endpoint with input validation and tests.  

---

## Developer notes for this submission

- **Tests and coverage:** see `NOTES.md` for the coverage summary (Statements ≈ 93%, Branches ≈ 84.5%, Functions ≈ 93.5%, Lines ≈ 92.6%) and what I would test next.  
- **Bug report and fixes:** see `BUG_REPORT.md` for details of the issues I identified (e.g. pagination offset) and the fix I implemented in `getPaginated`.  
- **New feature:** `PATCH /tasks/:id/assign` is implemented with validation (`assignee` must be a non‑empty string), proper 404 handling for missing tasks, and tests at both service and route level.

---

## How to review

1. Clone the repository:

   ```bash
   git clone https://github.com/AnkitDimri4/Take-Home-Assignment-The-Untested-API.git
   cd Take-Home-Assignment-The-Untested-API/task-api
   ```

2. Install dependencies and run the tests:

   ```bash
   npm install
   npm test
   npm run coverage
   ```

3. Check:
   - [`BUG_REPORT.md`](./BUG_REPORT.md) for identified bugs and the fix.
   - [`NOTES.md`](./NOTES.md) for coverage numbers, additional test ideas, surprises, and questions I would raise before production.

---

## Deployed API

For convenience, the API is also deployed on Render:

- Base URL: https://take-home-assignment-the-untested-api-1qkg.onrender.com

Example requests:

- `GET https://take-home-assignment-the-untested-api-1qkg.onrender.com/tasks`
- `GET https://take-home-assignment-the-untested-api-1qkg.onrender.com/tasks/stats`

---

## Author

**Ankit Dimri**  
Full‑Stack & AI Developer  
GitHub: [![GitHub](https://img.shields.io/badge/GitHub-AnkitDimri4-black?logo=github)](https://github.com/AnkitDimri4)

---