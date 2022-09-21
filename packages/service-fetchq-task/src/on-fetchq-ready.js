/**
 * Push into the tasks queue all the registered tasks
 */
module.exports = async ({ fetchq }, { getContext }) => {
  const queueName = getContext('fetchq.task.queueName');
  for (const { subject, payload } of getContext('fetchq.task.register')) {
    await fetchq.doc.push(queueName, {
      subject,
      payload,
    });
  }
};
