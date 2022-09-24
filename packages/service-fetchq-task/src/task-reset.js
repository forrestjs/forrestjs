const {
  computeNextIteration
} = require("fetchq/lib/utils/compute-next-iteration");

module.exports = async (subject, msg, { log, getContext }) => {
  msg && log.info(msg);
  const fetchq = getContext("fetchq");
  const queueName = getContext("fetchq.task.queueName");
  const tasks = getContext("fetchq.task.register");

  // Get the task
  const task = tasks.find((task) => task.subject === subject);
  if (!task) {
    throw new Error(`[fetchq-task] Reset task not found: ${subject}`);
  }

  // Run the reset query
  const { payload = {}, firstIteration = "now" } = task;
  const encodedPayload = JSON.stringify(payload || {}).replace(/'/g, "''''");
  const sql = `
      UPDATE fetchq_data.${queueName}__docs SET
        "status" = 1,
        "attempts" = 0,
        "iterations" = 0,
        "created_at" = now(),
        "last_iteration" = NULL,
        "next_iteration" = ${computeNextIteration(
          firstIteration === "now" ? "1970-01-01" : firstIteration
        )},
        "payload" = $1
      WHERE "subject" = $2;
    `;

  await fetchq.pool.query(sql, [encodedPayload, subject]);
};
