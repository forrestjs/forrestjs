const onInitService = require('./on-init-service');
const onFetchqReady = require('./on-fetchq-ready');
const onFetchqRegisterQueue = require('./on-fetchq-register-queue');
const onFetchqRegisterWorker = require('./on-fetchq-register-worker');

const fetchqTask = ({ registerTargets }) => {
  registerTargets({
    FETCHQ_REGISTER_TASK: 'fetchq/task/register',
  });

  return [
    {
      target: '$INIT_SERVICE',
      handler: onInitService,
    },
    {
      target: '$FETCHQ_REGISTER_QUEUE',
      handler: onFetchqRegisterQueue,
    },
    {
      target: '$FETCHQ_READY',
      handler: onFetchqReady,
    },
    {
      target: '$FETCHQ_REGISTER_WORKER',
      handler: onFetchqRegisterWorker,
    },
  ];
};

module.exports = fetchqTask;
