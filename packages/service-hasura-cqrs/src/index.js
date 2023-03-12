const onInitService = require("./on-init-service");
// const onFetchqRegisterQueue = require("./on-fetchq-register-queue");
const onFetchqRegisterWorker = require("./on-fetchq-register-worker");
const onFetchqRegisterTask = require("./on-fetchq-register-task");
const onFetchqIsReady = require("./on-fetchq-is-ready");

const service = {
  name: "hasura-cqrs",
  trace: __filename
};

module.exports = ({ registerTargets }) => {
  registerTargets({
    HASURA_CQRS_SOURCE: `${service.name}/register/source`,
    HASURA_CQRS_ROUTER: `${service.name}/register/router`,
    HASURA_CQRS_SHARD: `${service.name}/register/shard`,
    HASURA_CQRS_RESTIFY: `${service.name}/register/rest`
  });

  return [
    {
      ...service,
      priority: 1, // Must run before "hasura-task"
      target: "$INIT_SERVICE",
      handler: onInitService
    },
    // {
    //   ...service,
    //   target: "$FETCHQ_REGISTER_QUEUE",
    //   handler: onFetchqRegisterQueue
    // },
    {
      ...service,
      target: "$FETCHQ_REGISTER_WORKER",
      handler: onFetchqRegisterWorker
    },
    {
      ...service,
      target: "$FETCHQ_REGISTER_TASK",
      handler: onFetchqRegisterTask
    },
    {
      ...service,
      target: "$FETCHQ_READY",
      handler: onFetchqIsReady
    }
  ];
};
