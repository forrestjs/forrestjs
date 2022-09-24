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
    throw new Error(`[fetchq-task] Run task not found: ${subject}`);
  }

  // Run the reset query
  const sql = `
      UPDATE fetchq_data.${queueName}__docs SET
        "status" = 1,
        "attempts" = 0,
        "next_iteration" = ${computeNextIteration("1970-01-01")}
      WHERE "subject" = $1;
    `;

  await fetchq.pool.query(sql, [subject]);
};
