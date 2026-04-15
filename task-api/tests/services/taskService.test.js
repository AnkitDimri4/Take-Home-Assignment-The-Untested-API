const taskService = require("../../src/services/taskService");

describe("taskService", () => {
  beforeEach(() => {
    taskService._reset();
  });

  describe("create", () => {
    test("creates a task with defaults", () => {
      const task = taskService.create({ title: "Sample task" });

      expect(task).toHaveProperty("id");
      expect(task.title).toBe("Sample task");
      expect(task.description).toBe("");
      expect(task.status).toBe("todo");
      expect(task.priority).toBe("medium");
      expect(task.dueDate).toBeNull();
      expect(task.completedAt).toBeNull();
      expect(typeof task.createdAt).toBe("string");
    });

    test("respects provided optional fields", () => {
      const dueDate = new Date().toISOString();
      const task = taskService.create({
        title: "Custom task",
        description: "desc",
        status: "in_progress",
        priority: "high",
        dueDate,
      });

      expect(task.description).toBe("desc");
      expect(task.status).toBe("in_progress");
      expect(task.priority).toBe("high");
      expect(task.dueDate).toBe(dueDate);
    });
  });

  describe("getAll and findById", () => {
    test("getAll returns all created tasks", () => {
      const t1 = taskService.create({ title: "T1" });
      const t2 = taskService.create({ title: "T2" });

      const all = taskService.getAll();
      expect(all).toHaveLength(2);
      const ids = all.map((t) => t.id);
      expect(ids).toContain(t1.id);
      expect(ids).toContain(t2.id);
    });

    test("findById returns correct task or undefined", () => {
      const t1 = taskService.create({ title: "T1" });

      const found = taskService.findById(t1.id);
      expect(found).toBeDefined();
      expect(found.id).toBe(t1.id);

      const missing = taskService.findById("non-existent-id");
      expect(missing).toBeUndefined();
    });
  });

  describe("getByStatus", () => {
    test("filters tasks by exact status (current implementation uses includes)", () => {
      const t1 = taskService.create({ title: "T1", status: "todo" });
      const t2 = taskService.create({ title: "T2", status: "in_progress" });

      const todos = taskService.getByStatus("todo");
      expect(todos).toHaveLength(1);
      expect(todos[0].id).toBe(t1.id);

      const inProgress = taskService.getByStatus("in_progress");
      expect(inProgress).toHaveLength(1);
      expect(inProgress[0].id).toBe(t2.id);
    });

    test("demonstrates potential bug: includes() matches partial strings", () => {
      taskService.create({ title: "T1", status: "todo" });

      const result = taskService.getByStatus("to");
      expect(result).toHaveLength(1);
    });
  });

  describe("getPaginated", () => {
    test("returns correct slice for first page", () => {
      for (let i = 1; i <= 5; i++) {
        taskService.create({ title: `T${i}` });
      }

      const tasksPage1 = taskService.getPaginated(1, 2);

      expect(tasksPage1).toHaveLength(2);
      const titles = tasksPage1.map((t) => t.title);
      expect(titles).toEqual(["T1", "T2"]);
    });

    test("returns next slice for second page", () => {
      taskService._reset();
      for (let i = 1; i <= 5; i++) {
        taskService.create({ title: `T${i}` });
      }

      const tasksPage2 = taskService.getPaginated(2, 2);

      expect(tasksPage2).toHaveLength(2);
      const titles = tasksPage2.map((t) => t.title);
      expect(titles).toEqual(["T3", "T4"]);
    });
  });

  describe("getStats", () => {
    test("returns counts by status and overdue", () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // yesterday
      const futureDate = new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      ).toISOString(); // tomorrow

      taskService.create({
        title: "Todo overdue",
        status: "todo",
        dueDate: pastDate,
      });
      taskService.create({
        title: "In progress not overdue",
        status: "in_progress",
        dueDate: futureDate,
      });
      taskService.create({
        title: "Done overdue but completed",
        status: "done",
        dueDate: pastDate,
      });

      const stats = taskService.getStats();

      expect(stats.todo).toBe(1);
      expect(stats.in_progress).toBe(1);
      expect(stats.done).toBe(1);
      expect(stats.overdue).toBe(1);
    });
  });

  describe("update", () => {
    test("updates an existing task", () => {
      const t1 = taskService.create({ title: "Original" });

      const updated = taskService.update(t1.id, {
        title: "Updated",
        priority: "high",
      });

      expect(updated).not.toBeNull();
      expect(updated.title).toBe("Updated");
      expect(updated.priority).toBe("high");
    });

    test("returns null when updating non-existent task", () => {
      const updated = taskService.update("non-existent", { title: "Updated" });
      expect(updated).toBeNull();
    });
  });

  describe("remove", () => {
    test("removes a task and returns true", () => {
      const t1 = taskService.create({ title: "To delete" });

      const result = taskService.remove(t1.id);
      expect(result).toBe(true);

      const all = taskService.getAll();
      expect(all).toHaveLength(0);
    });

    test("returns false when task not found", () => {
      const result = taskService.remove("non-existent");
      expect(result).toBe(false);
    });
  });

  describe("completeTask", () => {
    test("marks task as done and sets completedAt", () => {
      const t1 = taskService.create({ title: "Complete me", priority: "high" });

      const completed = taskService.completeTask(t1.id);

      expect(completed).not.toBeNull();
      expect(completed.status).toBe("done");
      expect(typeof completed.completedAt).toBe("string");
      expect(completed.priority).toBe("medium");
    });

    test("returns null for non-existent task", () => {
      const completed = taskService.completeTask("non-existent");
      expect(completed).toBeNull();
    });
  });
  
  describe("assignTask", () => {
    test("assigns a task when it exists", () => {
      const created = taskService.create({ title: "Assign me" });

      const updated = taskService.assignTask(created.id, "Alice");

      expect(updated).not.toBeNull();
      expect(updated.assignee).toBe("Alice");

      const found = taskService.findById(created.id);
      expect(found.assignee).toBe("Alice");
    });

    test("returns null when task does not exist", () => {
      const updated = taskService.assignTask("non-existent", "Bob");
      expect(updated).toBeNull();
    });
  });
});
