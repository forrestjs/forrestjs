const axios = require("axios");
const makeLogger = require("../utils/make-logger");

module.exports = async (
  { queue, subject, payload, complete, kill, drop },
  { log: logger, getContext, hasura }
) => {
  // Get the restify definition:
  const restify = getContext(`hasuraCQRS.restify.map.${queue}`);
  if (!restify) {
    logger.error(`[hasura-cqrs] Restify definition not found`, { queue });
    return kill("Restify definition not found", { details: { queue } });
  }

  // Build local logger:
  const log = makeLogger(logger, restify.shouldLog);

  log.info(`[hasura-cqrs] Restify start`, { queue, subject });

  const {
    endpoint,
    graphqlQuery,
    buildQueryVariables,
    shouldSendResponse,
    shouldSendError,
    buildRequestBody,
    dropOnComplete
  } = restify;

  try {
    const requestBody = buildRequestBody(payload);
    log.verbose(`[hasura-cqrs] Restify send request`, {
      queue,
      endpoint,
      requestBody
    });
    const res = await axios.post(endpoint, requestBody);
    log.verbose(`[hasura-cqrs] Restify success`, {
      queue,
      endpoint,
      requestBody,
      responseData: res.data
    });

    // If the response contains the "skipCQRSResponse" key we assume
    // that the backend will eventually take care of writing into
    // the CQRS response table.
    if (shouldSendResponse(res.data, payload)) {
      log.verbose(`[hasura-cqrs] Compute GraphQL Response variables`, {
        queue,
        payload,
        responseData: res.data
      });
      const variables = buildQueryVariables(payload, res.data, null);
      log.verbose(`[hasura-cqrs] Restify write CQRS response`, {
        queue,
        variables
      });
      const response = await hasura.query(graphqlQuery, variables);
      log.verbose(`[hasura-cqrs] Restify wrote response`, {
        variables,
        response
      });
    } else {
      log.verbose(`[hasura-cqrs] Skip CQRS response`, {
        queue
      });
    }
  } catch (err) {
    log.error(`[hasura-cqrs] Restify request failed`, {
      errorMessage: err.message,
      queue,
      endpoint,
      payload
    });

    if (shouldSendError(err)) {
      try {
        log.verbose(`[hasura-cqrs] Compute GraphQL Error variables`, {
          queue,
          payload,
          error: err
        });
        const variables = buildQueryVariables(payload, null, err);
        log.verbose(`[hasura-cqrs] Restify write CQRS error`, {
          queue,
          variables
        });
        const response = await hasura.query(graphqlQuery, variables);
        log.verbose(`[hasura-cqrs] Restify wrote error`, {
          variables,
          response
        });
      } catch (err1) {
        log.error(`[hasura-cqrs] Restify failed to write CQRS error`, {
          errorMessage: err1.message,
          queue,
          originalError: err1
        });
      }
    }

    return kill(err.message);
  }

  // Apply termination policy:
  log.info(`[hasura-cqrs] Restify has completed`, {
    queue,
    subject,
    action: dropOnComplete ? "drop" : "complete"
  });
  return dropOnComplete ? drop() : complete();
};
