class FetchqCQRShardError extends Error {
  constructor(message) {
    super(message);
    this.name = "FetchqCQRShardError";
  }
}

module.exports = ({
  source,
  targets, // List of shard names
  router, // Router function, shoud return one target
  checkOnBoot = true,
  dropOnComplete = true,
  workerSettings = {},
  shouldLog = true
} = {}) => {
  if (!source || source === "") {
    throw new FetchqCQRShardError("Missing property: source");
  }
  if (!Array.isArray(targets)) {
    throw new FetchqCQRShardError("Missing property: targets");
  }
  if (!targets.length) {
    throw new FetchqCQRShardError("A Shard needs at least one shard");
  }
  if (!router || typeof router !== "function") {
    throw new FetchqCQRShardError("Missing property: router");
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
