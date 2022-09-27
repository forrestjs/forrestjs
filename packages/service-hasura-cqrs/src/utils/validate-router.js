class FetchqCQRSRouterError extends Error {
  constructor(message) {
    super(message);
    this.name = "FetchqCQRSRouterError";
  }
}

module.exports = ({
  source,
  targets, // Name of the accepted destination queues or pipelines

  /**
   * Routes a document towards one or more pipelines.
   * @param {Object} sourcedItem
   * @param {String} sourceName
   * @return {String[]} A list of target queues where to forward the item for further processing
   */
  router,

  checkOnBoot = true,
  dropOnComplete = true,
  workerSettings = {},
  shouldLog = true
} = {}) => {
  if (!source || source === "") {
    throw new FetchqCQRSRouterError("Missing property: source");
  }
  if (!Array.isArray(targets)) {
    throw new FetchqCQRSRouterError("Missing property: targets");
  }
  if (!targets.length) {
    throw new FetchqCQRSRouterError("A router needs at least one target");
  }
  if (!router || typeof router !== "function") {
    throw new FetchqCQRSRouterError("Missing property: router");
  }

  return {
    source,
    targets,
    router,
    checkOnBoot: Boolean(checkOnBoot),
    dropOnComplete: Boolean(dropOnComplete),
    workerSettings,
    shouldLog
  };
};
