const makeLogger = require("../utils/make-logger");

module.exports = async (
  { queue, subject, payload, complete, kill, forward, drop },
  { log: logger, getContext }
) => {
  // Get the router definition:
  const router = getContext(`hasuraCQRS.routers.map.${queue}`);
  if (!router) {
    logger.error(`[hasura-cqrs] Router not found`, { queue });
    return kill("Router not found", { details: { queue } });
  }

  // Build local logger:
  const log = makeLogger(logger, router.shouldLog);

  log.info(`[hasura-cqrs] Router started`, {
    queue,
    subject
  });

  // Run the router's handler:
  // In case of failure, the entire worker should be stopped
  // (how the hell do we do that?)
  const targets = router.router(payload, router.source);
  log.verbose(`[hasura-cqrs] Route has generating targets`, {
    queue,
    subject,
    payload,
    targets
  });

  if (!Array.isArray(targets)) {
    log.error(
      `[hasura-cqrs] Router returns wrong type, it should return an array of targets`,
      {
        queue,
        targets
      }
    );
    return kill(
      "Router returns wrong type, it should return an array of targets",
      { details: { queue, targets } }
    );
  }
  if (!targets.every((v) => router.targets.includes(v))) {
    log.error(`[hasura-cqrs] Router return an unknown target`, {
      queue,
      target
    });
    return kill("Router return an unknown target", {
      details: { queue, target }
    });
  }

  // Forward the document to multiple targets:
  await Promise.all(targets.map((target) => forward(target)));

  // Apply termination policy:
  log.info(`[hasura-cqrs] Router has completed`, {
    queue,
    subject,
    action: router.dropOnComplete ? "drop" : "complete"
  });
  return router.dropOnComplete ? drop() : complete();
};
