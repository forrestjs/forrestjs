const onInitService = require("./on-init-service");
const onFetchqReady = require("./on-fetchq-ready");
const taskWorker = require("./task-worker");

const fetchqTask = ({ registerTargets }) => {
  registerTargets({
    FETCHQ_REGISTER_TASK: "fetchq/task/register"
  });

  return [
    {
      target: "$INIT_SERVICE",
      handler: onInitService
    },
    {
      target: "$FETCHQ_REGISTER_QUEUE",
      handler: {
        name: "task"
      }
    },
    {
      target: "$FETCHQ_READY",
      handler: onFetchqReady
    },
    {
      target: "$FETCHQ_REGISTER_WORKER",
      handler: {
        queue: "task",
        handler: taskWorker
      }
    }
  ];
};

module.exports = fetchqTask;
