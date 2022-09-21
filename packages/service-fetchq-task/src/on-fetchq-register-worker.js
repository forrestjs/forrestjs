const taskWorker = require('./task-worker');

module.exports = (_, { getContext }) => {
  const queueName = getContext('fetchq.queueName');
  const workerSettings = getContext('fetchq.workerSettings');
  return [
    {
      ...workerSettings,
      queue: queueName,
      handler: taskWorker,
    },
  ];
};
