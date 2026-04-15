const VALID_STATUSES = ["todo", "in_progress", "done"];
const VALID_PRIORITIES = ["low", "medium", "high"];

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;
function validateCreateTask(body) {
  if (!isNonEmptyString(body.title)) {
    return "Title is required and must be a non-empty string";
  }
  if (body.status && !VALID_STATUSES.includes(body.status)) {
    return "Invalid status";
  }
  if (body.priority && !VALID_PRIORITIES.includes(body.priority)) {
    return "Invalid priority";
  }
  return null;
}
function validateUpdateTask(body) {
  if (!isNonEmptyString(body.title)) {
    return "Title is required and must be a non-empty string";
  }
  if (body.status && !VALID_STATUSES.includes(body.status)) {
    return "Invalid status";
  }
  if (body.priority && !VALID_PRIORITIES.includes(body.priority)) {
    return "Invalid priority";
  }
  return null;
}
function validateAssignTask(body) {
  if (!isNonEmptyString(body.assignee)) {
    return "Assignee is required and must be a non-empty string";
  }
  return null;
}
module.exports = { validateCreateTask, validateUpdateTask, validateAssignTask };
