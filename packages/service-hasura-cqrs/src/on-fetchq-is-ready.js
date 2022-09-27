const hasProp = require("./utils/filter-has-prop");
const toCheck = hasProp("checkOnBoot", true);

class HasuraCQRSQueueNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "HasuraCQRSQueueNotFoundError";
  }
}

module.exports = async ({ fetchq }, { log, getContext }) => {
  const sourceQueues = getContext("hasuraCQRS.sources.list")
    .filter(toCheck)
    .reduce((a, c) => [...a, ...c.targets], []);

  const routerQueues = getContext("hasuraCQRS.routers.list")
    .filter(toCheck)
    .reduce((a, c) => [...a, ...c.targets, c.source], []);

  const shardsQueues = getContext("hasuraCQRS.shards.list")
    .filter(toCheck)
    .reduce((a, c) => [...a, ...c.targets, c.source], []);

  const restifyQueues = getContext("hasuraCQRS.restify.list")
    .filter(toCheck)
    .reduce((a, c) => [...a, ...c.sources], []);

  // Deduplicate occurrences:
  // https://stackoverflow.com/a/9229821/1308023
  const verifyQueues = new Set([
    ...sourceQueues,
    ...routerQueues,
    ...shardsQueues,
    ...restifyQueues
  ]);

  // NOTE: this could be performed in one single call by
  //       querying "fetchq"."queue" to check the existance of them all
  for (const target of verifyQueues) {
    // Try to fetch some data:
    try {
      log.verbose(`[hasura-cqrs] Verify queue: ${target}`);
      await fetchq.pool.query(
        `SELECT "subject" FROM "fetchq_data"."${target}__docs" LIMIT 1`
      );
    } catch (err) {
      log.error(`[hasura-cqrs] Ingest queue not found: ${target}`);

      throw new HasuraCQRSQueueNotFoundError(
        `Ingest queue not found: ${target}`
      );
    }
  }
};
