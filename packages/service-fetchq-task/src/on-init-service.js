/**
 * Collect tasks definition from:
 * - app's configuration
 * - extensions
 *
 * @param {*} param0
 */
module.exports = ({ createExtension, getConfig, setContext }) => {
  const registerTasks = [
    // Collect from App configuration
    ...getConfig("fetchq.task.register", []),
    // Collect from other extensions
    ...createExtension.sync("$FETCHQ_REGISTER_TASK").map(($) => $[0])
  ];

  // TODO: validate tasks DTO
  //       maybe with AJV?
  const validateTaskDTO = () => true;
  if (!registerTasks.every(validateTaskDTO)) {
    throw new Error(`FetchqTask invalid format`);
  }

  setContext("fetchq.task.register", registerTasks);
};
