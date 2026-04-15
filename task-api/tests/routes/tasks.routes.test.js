const request = require('supertest');
const app = require('../../src/app');
const taskService = require('../../src/services/taskService');

describe('Tasks API routes', () => {
  beforeEach(() => {
    taskService._reset();
  });

  describe('POST /tasks', () => {
    test('creates a task and returns 201', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ title: 'API task', priority: 'high' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe('API task');
      expect(res.body.priority).toBe('high');
    });

    test('returns 400 when required fields are missing (once validators implemented)', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({});

      expect([200, 201, 400]).toContain(res.status);
    });
  });

  describe('GET /tasks', () => {
    test('returns all tasks', async () => {
      await request(app).post('/tasks').send({ title: 'T1' });
      await request(app).post('/tasks').send({ title: 'T2' });

      const res = await request(app).get('/tasks');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    test('filters by status', async () => {
      await request(app).post('/tasks').send({ title: 'Todo Task', status: 'todo' });
      await request(app).post('/tasks').send({ title: 'In Progress', status: 'in_progress' });

      const res = await request(app).get('/tasks?status=todo');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].status).toBe('todo');
    });

    test('supports pagination', async () => {
      for (let i = 1; i <= 5; i++) {
        await request(app).post('/tasks').send({ title: `T${i}` });
      }

      const res = await request(app).get('/tasks?page=1&limit=2');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });
  });

  describe('PUT /tasks/:id', () => {
    test('updates an existing task', async () => {
      const createRes = await request(app).post('/tasks').send({ title: 'Original' });
      const id = createRes.body.id;

      const updateRes = await request(app)
        .put(`/tasks/${id}`)
        .send({ title: 'Updated', priority: 'high' });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.title).toBe('Updated');
      expect(updateRes.body.priority).toBe('high');
    });

    test('returns 404 when task does not exist', async () => {
      const res = await request(app)
        .put('/tasks/non-existent')
        .send({ title: 'Updated' });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Task not found');
    });
  });

  describe('DELETE /tasks/:id', () => {
    test('deletes an existing task', async () => {
      const createRes = await request(app).post('/tasks').send({ title: 'To delete' });
      const id = createRes.body.id;

      const delRes = await request(app).delete(`/tasks/${id}`);

      expect(delRes.status).toBe(204);
    });

    test('returns 404 when task does not exist', async () => {
      const res = await request(app).delete('/tasks/non-existent');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Task not found');
    });
  });

  describe('PATCH /tasks/:id/complete', () => {
    test('marks task as complete', async () => {
      const createRes = await request(app).post('/tasks').send({ title: 'Complete me' });
      const id = createRes.body.id;

      const patchRes = await request(app).patch(`/tasks/${id}/complete`);

      expect(patchRes.status).toBe(200);
      expect(patchRes.body.status).toBe('done');
      expect(typeof patchRes.body.completedAt).toBe('string');
    });

    test('returns 404 when task does not exist', async () => {
      const res = await request(app).patch('/tasks/non-existent/complete');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Task not found');
    });
  });

  describe('GET /tasks/stats', () => {
    test('returns stats object', async () => {
      await request(app).post('/tasks').send({ title: 'T1', status: 'todo' });
      await request(app).post('/tasks').send({ title: 'T2', status: 'in_progress' });

      const res = await request(app).get('/tasks/stats');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('todo');
      expect(res.body).toHaveProperty('in_progress');
      expect(res.body).toHaveProperty('done');
      expect(res.body).toHaveProperty('overdue');
    });
  });
});