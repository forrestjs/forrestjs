/**
 * Transforms a Restify definition into a Fetchq Task
 * @param {*} options FetchqWorker options
 * @returns
 */

module.exports =
  (options = {}) =>
  (restifyMap) =>
    Object.keys(restifyMap).map((queue) => ({
      ...restifyMap[queue].workerSettings,
      ...options,
      queue,
      concurrency: 1
    }));
