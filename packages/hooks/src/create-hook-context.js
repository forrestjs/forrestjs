/**
 * ExpressJS Middleware
 *
 * creates a unique context name that can be used to trace request
 * related hooks.
 *
 * the entire trace gets removed after a while to keep memory under control.
 */

const { deleteTrace } = require('./state');
const { traceHook, logTrace } = require('./tracer');

let traceIndex = 0;

const createHookContext =
  (settings = {}) =>
  (req, res, next) => {
    const namespace = settings.namespace || 'hooks';
    const expiry = settings.expiry || 5000;
    const log = settings.logging || console.log;
    const traceId = traceIndex++;

    const hooks = {
      ...(settings.inject || {}),
      traceId,
      getTrace: traceHook(traceId),
      logTrace: (showBoot) =>
        logTrace(log)(traceId)({
          title: req.originalUrl,
          showBoot,
        }),
    };

    // clean out request trace
    setTimeout(() => deleteTrace(traceId), expiry);

    req[namespace] = hooks;
    next();
  };

module.exports = { createHookContext };
