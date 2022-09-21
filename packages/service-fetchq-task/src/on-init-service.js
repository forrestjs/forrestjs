/**
 * Collect tasks definition from:
 * - app's configuration
 * - extensions
 *
 * @param {*} param0
 */
module.exports = ({ createExtension, getConfig, setContext }) => {
  const queueName = getConfig('fetchq.task.queue.name', 'task');
  const queueSettings = getConfig('fetchq.task.queue.settings', {});
  const workerSettings = getConfig('fetchq.task.worker.settings', {});

  const registerTasks = [
    // Collect from App configuration
    ...getConfig('fetchq.task.register', []),
    // Collect from other extensions
    ...createExtension.sync('$FETCHQ_REGISTER_TASK').map(($) => $[0]),
  ];

  // TODO: validate tasks DTO
  //       maybe with AJV?
  const validateTaskDTO = () => true;
  if (!registerTasks.every(validateTaskDTO)) {
    throw new Error(`FetchqTask invalid format`);
  }

  setContext('fetchq.task', {
    queueName,
    queueSettings,
    workerSettings,
    register: registerTasks,
  });
};
