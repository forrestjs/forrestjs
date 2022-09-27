const makeLogger = require("../utils/make-logger");

module.exports = async (
  { queue, subject, payload, complete, kill, forward, drop },
  { log: logger, getContext }
) => {
  // Get the shard definition:
  const shard = getContext(`hasuraCQRS.shards.map.${queue}`);
  if (!shard) {
    logger.error(`[hasura-cqrs] Shard not found for queue: ${queue}`);
    return kill("Shard not found", { details: { queue } });
  }

  // Build local logger:
  const log = makeLogger(logger, shard.shouldLog);

  log.info(`[hasura-cqrs] Shard started`, {
    queue,
    subject
  });

  // Run the shard's handler
  // In case of failure, the entire worker should be stopped
  // (how the hell do we do that?)
  const target = shard.router(payload);
  if (!shard.targets.includes(target)) {
    log.error(`[hasura-cqrs] Shard return an unknown target`, {
      target,
      queue
    });
    return kill("Shard return an unknown target", {
      details: { target, queue }
    });
  }

  await forward(target);

  // Apply termination policy:
  log.info(`[hasura-cqrs] Shard has completed`, {
    queue,
    subject,
    action: shard.dropOnComplete ? "drop" : "complete"
  });
  return shard.dropOnComplete ? drop() : complete();
};
