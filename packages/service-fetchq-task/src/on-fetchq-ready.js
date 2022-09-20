/**
 * Push into the tasks queue all the registered tasks
 */
module.exports = async ({ fetchq }, { getContext }) => {
  for (const { subject, payload } of getContext("fetchq.task.register")) {
    await fetchq.doc.push("task", {
      subject,
      payload
    });
  }
};
