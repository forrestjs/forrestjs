module.exports = (_, { getContext }) => {
  const queueName = getContext('fetchq.task.queueName');
  const queueSettings = getContext('fetchq.task.queueSettings');

  return [
    {
      ...queueSettings,
      name: queueName,
    },
  ];
};
