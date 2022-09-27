/**
 * Transforms a Router definition into a Fetchq Task
 * @param {*} options FetchqWorker options
 * @returns
 */

module.exports =
  (options = {}) =>
  ({ source: queue, workerSettings }) => ({
    ...workerSettings,
    ...options,
    queue,
    concurrency: 1
  });
