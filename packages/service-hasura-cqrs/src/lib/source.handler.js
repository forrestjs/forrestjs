const makeLogger = require("../utils/make-logger");

module.exports = async (
  { payload, reschedule, logError },
  { log: logger, getContext, hasura, fetchq }
) => {
  const { source, cursor } = payload;
  const {
    graphqlQuery,
    buildQueryVariables,
    targets,
    router: routingFn,
    sleepOnSuccess,
    sleepOnEmpty,
    sleepOnError,
    buildSubject,
    buildDocument,
    buildNextCursor,
    shouldLog
  } = getContext(`hasuraCQRS.sources.map.${source}`);

  // Build local logger:
  const log = makeLogger(logger, shouldLog);

  log.verbose(`[hasura-cqrs] Source CQRS commands with cursor`, {
    source,
    cursor
  });

  try {
    log.verbose(`[hasura-cqrs] Source GraphQL variables`, {
      source,
      payload
    });
    const variables = buildQueryVariables(payload, source);

    log.verbose(`[hasura-cqrs] Source GraphQL query`, {
      source,
      payload,
      variables
      // graphqlQuery
    });
    const { items } = await hasura.query(graphqlQuery, variables);

    // Handle empty source:
    if (!items.length) {
      log.verbose(`[hasura-cqrs] Source is empty`, {
        source,
        sleepOnEmpty
      });
      return reschedule(sleepOnEmpty);
    }

    // Push items into the target queue:
    log.verbose(`[hasura-cqrs] Source apply routing to commands`, {
      source,
      targets,
      items: items.length
    });

    // TODO: This whole logic should be moved into a pute
    //       function and thoroughly unit tested
    const routedItems = items.reduce((acc, curr) => {
      const routedTargets = routingFn(curr, targets);

      if (!routedTargets.every((v) => targets.includes(v))) {
        const error = new Error(
          "Source attempts to route to a non declared target"
        );
        error.details = {
          availableTargets: targets,
          routedTargets
        };
        throw error;
      }

      return routedTargets.reduce((acc, target) => {
        if (!acc[target]) {
          acc[target] = [];
        }
        acc[target].push(curr);
        return acc;
      }, acc);
    }, {});
    log.verbose(`[hasura-cqrs] Source commands have been routed`, {
      source,
      targets,
      routedItems
    });

    // Push into the queues and collect the resulting log
    const routes = Object.keys(routedItems);
    const routingResult = (
      await Promise.all(
        routes.map((target) =>
          fetchq.doc.pushMany(target, {
            docs: routedItems[target].map((item) => [
              buildSubject(item, source),
              null,
              buildDocument(item, source)
            ])
          })
        )
      )
    ).map((result, idx) => ({
      target: routes[idx],
      total: routedItems[routes[idx]].length,
      queued: result["queued_docs"]
    }));
    log.info(`[hasura-cqrs] Source commands have been pushed`, {
      source,
      targets,
      routingResult
    });

    // Reschedule with last command etag
    const nextCursor = buildNextCursor(items[items.length - 1]);
    log.info(`[hasura-cqrs] Source will attempt a new execution immediately`, {
      nextIteration: sleepOnSuccess,
      nextCursor
    });
    return reschedule(sleepOnSuccess, {
      payload: {
        source,
        cursor: nextCursor
      }
    });
  } catch (err) {
    // Send error to the sterr
    log.error(`[hasura-cqrs] Source miserably failed`, {
      source,
      originalErrorMessage: err.message,
      originalError: err
    });

    // The queue log should not break the logic in any way
    try {
      await logError(err.message.replaceAll("'", `"`), {
        response: {
          status: err.response ? err.response.status : null,
          data: err.response ? err.response.data : null
        }
      });
    } catch (err) {}

    log.verbose(`[hasura-cqrs] Source will reschedule due to an error`, {
      source,
      sleepOnError
    });

    return reschedule(sleepOnError);
  }
};
