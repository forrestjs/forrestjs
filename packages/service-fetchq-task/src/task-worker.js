/**
 * Matches the task definition from memory and executes it.
 */
module.exports = async (doc, ctx) => {
  const task = ctx
    .getContext("fetchq.task.register")
    .find((task) => task.subject === doc.subject);

  if (!task) {
    return doc.kill("Task not found");
  }

  // Execute and honor the returning action:
  const result = await task.handler(doc, ctx);
  if (result) return result;

  // Use the configuration for setting up next execution:
  if (task.nextIteration) {
    return doc.reschedule(task.nextIteration);
  }

  return doc.complete();
};
