const taskWorker = require('./task-worker');

module.exports = (_, { getContext }) => {
  const queueName = getContext('fetchq.task.queueName');
  const workerSettings = getContext('fetchq.task.workerSettings');
  return [
    {
      ...workerSettings,
      queue: queueName,
      handler: taskWorker,
    },
  ];
};
