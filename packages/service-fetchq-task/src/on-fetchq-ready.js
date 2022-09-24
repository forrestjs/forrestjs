/**
 * Push into the tasks queue all the registered tasks
 */
module.exports = async ({ fetchq }, { getContext, log }) => {
  const queueName = getContext("fetchq.task.queueName");
  const resetTask = getContext("fetchq.task.reset");

  for (const {
    subject,
    payload = {},
    firstIteration = "now",
    resetOnBoot
  } of getContext("fetchq.task.register")) {
    // Schedule the task:
    log.info(`[fetchq-task] Schedule "${subject}" at "${firstIteration}"`);
    await fetchq.doc.push(queueName, {
      subject,
      payload,
      ...(firstIteration === "now" ? {} : { nextIteration: firstIteration })
    });

    // ResetOnBoot the task:
    if (resetOnBoot)
      await resetTask(
        subject,
        `Reset on Boot "${subject}" at "${firstIteration}"`
      );
  }
};
