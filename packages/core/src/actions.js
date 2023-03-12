const { traceAction } = require('./tracer');
const { logAction, getLevelNumber } = require('./logger');

const scalars = ['number', 'string', 'boolean'];

/**
 * TEMPORARY:
 * So far App context is passed as second parameter
 *
 * Lifecycle methods send in the ctx as first parameter as well,
 * so we have to detect this situation and replace with the
 * decorated context.
 *
 * TODO: Remove this check in v6x when the CTX will always
 *       go as first parameter.
 *
 * @param {*} args
 * @param {*} ctx
 * @returns
 */
const spreadArgs = (args, ctx) => {
  if (args !== null && typeof args === 'object' && args.log && args.getContext)
    return [ctx, ctx];

  return [scalars.includes(typeof args) ? args : { ...args }, ctx];
};

const conditionalLogger = ({ logLevel }, { context }) => {
  // Handle usage of isolated actions:
  if (!context || !context.log) {
    return null;
  }

  const { log } = context;

  // Handle pass-through scenarios:
  if (logLevel === true || (!logLevel && logLevel !== false)) {
    return log;
  }

  // Shut down the logger
  // It creates a dummy instance that implements all the
  if (logLevel === false) {
    const fakeLogger = () => {};
    Object.keys(log).forEach((key) => {
      if (typeof log[key] === 'function') {
        fakeLogger[key] = () => {};
      }
    });
    return fakeLogger;
  }

  // Try to create a clone with a different log level
  if (log.cloneWithLogLevel) {
    return log.cloneWithLogLevel(logLevel);
  }

  return log;
};

const runAction = async (action, options) => {
  logAction('run', action);
  try {
    traceAction(action, options);
    // console.log('@callASync');

    const args = spreadArgs(options.args, {
      ...options.context,
      log: conditionalLogger(action, options),
    });

    const result = await action.handler(...args);
    return [result, action, options];
  } catch (err) {
    return options.onItemError(err, action, options);
  }
};

const runActionSync = (action, options) => {
  logAction('run (sync)', action);
  try {
    traceAction(action, options);
    // console.log('@callSync');

    const args = spreadArgs(options.args, {
      ...options.context,
      log: conditionalLogger(action, options),
    });

    const result = action.handler(...args);
    return [result, action, options];
  } catch (err) {
    return options.onItemError(err, action, options);
  }
};

module.exports = { runAction, runActionSync };
