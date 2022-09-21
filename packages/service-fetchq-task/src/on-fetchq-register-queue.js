module.exports = (_, { getContext }) => {
  const queueName = getContext('fetchq.queueName');
  const queueSettings = getContext('fetchq.queueSettings');

  return [
    {
      ...queueSettings,
      name: queueName,
    },
  ];
};
