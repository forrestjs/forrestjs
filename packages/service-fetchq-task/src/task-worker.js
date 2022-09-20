/**
 * Matches the task definition from memory and executes it.
 */
module.exports = (doc, ctx) => {
  const task = ctx
    .getContext("fetchq.task.register")
    .find((task) => task.subject === doc.subject);

  if (!task) {
    return doc.kill("Task not found");
  }

  return task.handler(doc, ctx);
};
