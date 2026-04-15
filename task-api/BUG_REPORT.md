# Bug Report

## 1. Pagination offset bug in getPaginated (fixed)

- **Location:** `src/services/taskService.js`, function `getPaginated`.
- **Expected:** For `page = 1` and `limit = 2`, the API should return the first two tasks (`T1`, `T2`).
- **Actual (before fix):** The implementation used `const offset = page * limit;`, so page 1 computed offset `2` and returned `T3`, `T4`.
- **How discovered:** Through unit tests in `tests/services/taskService.test.js` for `getPaginated` after creating 5 tasks and checking page 1.
- **Fix implemented:** Updated to `const offset = (page - 1) * limit;` and adjusted tests to assert `['T1', 'T2']` for page 1 and `['T3', 'T4']` for page 2.

## 2. Status filtering uses includes (documented behaviour)

- **Location:** `src/services/taskService.js`, function `getByStatus`.
- **Expected:** Typically, filtering by status is done with exact matches (e.g. `todo`, `in_progress`, `done`).
- **Actual:** The implementation uses `t.status.includes(status)`, so a partial string such as `'to'` still matches `'todo'`.
- **How discovered:** Unit test `demonstrates potential bug: includes() matches partial strings` in `tests/services/taskService.test.js`.
- **Decision:** Left as is for now but documented, since the assignment did not strictly define whether partial matching is acceptable.

## 3. Validation gaps (addressed by adding validators)

- **Location:** `src/utils/validators.js` and its usage in `src/routes/tasks.js`.
- **Issue:** Initially, the API accepted payloads without key fields (e.g. missing `title`), and there was no centralized validation.
- **How discovered:** While designing integration tests for `POST /tasks` and `PUT /tasks/:id` in `tests/routes/tasks.routes.test.js` and checking expected `400` scenarios.
- **Fix implemented:** Introduced `validateCreateTask`, `validateUpdateTask`, and later `validateAssignTask` to enforce required fields and basic constraints and return `400` with a clear `error` message when validation fails.