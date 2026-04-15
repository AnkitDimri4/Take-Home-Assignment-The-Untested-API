## Test coverage

Command:

```bash
npm run coverage
```

Current coverage (on my machine):

- Statements: 93.33%
- Branches: 84.5%
- Functions: 93.54%
- Lines: 92.64%

## What I would test next

- Authentication and authorization around the task endpoints.
- More negative tests for invalid query parameters (e.g. non-numeric `page` and `limit`).
- Concurrency scenarios (multiple updates/deletes for the same task) and idempotency of PATCH endpoints.
- Performance and pagination behaviour with a large number of tasks.

## What surprised me

- Pagination offset used `page * limit` instead of `(page - 1) * limit`, which caused page 1 to skip the first tasks.
- Status filtering using `includes` instead of exact equality, which allows partial matches like `'to'` matching `'todo'`.
- The API was otherwise cleanly structured, with a clear separation between routes and service logic, making it straightforward to add tests.

## Questions before going to production

- What are the exact allowed status values (`todo`, `in_progress`, `done`) and should we enforce them strictly at the API boundary?
- Should completing a task preserve its priority or always reset to `medium`?
- Do we expect to support reassignment of tasks, or should assigning be a one-time operation?
- Will this API be exposed publicly, and if so, what authentication/authorization and rate limiting are required?
- Will we move from in-memory storage to a database, and if yes, what consistency and migration requirements do we have?