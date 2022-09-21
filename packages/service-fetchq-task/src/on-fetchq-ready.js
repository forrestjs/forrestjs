/**
 * Push into the tasks queue all the registered tasks
 */
module.exports = async ({ fetchq }, { getContext }) => {
  const queueName = getContext('fetchq.task.queueName');
  for (const { subject, payload, resetOnBoot } of getContext(
    'fetchq.task.register',
  )) {
    await fetchq.doc.push(queueName, {
      subject,
      payload,
    });

    if (resetOnBoot) {
      const encodedPayload = JSON.stringify(payload || {}).replace(
        /'/g,
        "''''",
      );
      const sql = `
        UPDATE fetchq_data.${queueName}__docs SET
          "status" = 1,
          "attempts" = 0,
          "iterations" = 0,
          "created_at" = now(),
          "last_iteration" = NULL,
          "next_iteration" = now(),
          "payload" = $1
        WHERE "subject" = $2;
      `;

      await fetchq.pool.query(sql, [encodedPayload, subject]);
    }
  }
};
