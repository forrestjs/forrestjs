const onInitService = require('./on-init-service');
const onFetchqReady = require('./on-fetchq-ready');
const onFetchqRegisterQueue = require('./on-fetchq-register-queue');
const onFetchqRegisterWorker = require('./on-fetchq-register-worker');

const service = {
  name: 'fetchq-task',
  trace: __filename,
};

module.exports = ({ registerTargets }) => {
  registerTargets({
    FETCHQ_REGISTER_TASK: 'fetchq/task/register',
  });

  return [
    {
      ...service,
      target: '$INIT_SERVICE',
      handler: onInitService,
    },
    {
      ...service,
      target: '$FETCHQ_REGISTER_QUEUE',
      handler: onFetchqRegisterQueue,
    },
    {
      ...service,
      target: '$FETCHQ_READY',
      handler: onFetchqReady,
    },
    {
      ...service,
      target: '$FETCHQ_REGISTER_WORKER',
      handler: onFetchqRegisterWorker,
    },
  ];
};
