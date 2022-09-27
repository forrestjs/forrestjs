const { traceAction } = require('./tracer');
const { logAction, getLevelNumber } = require('./logger');

const scalars = ['number', 'string', 'boolean'];

const spreadArgs = (args) =>
  scalars.includes(typeof args) ? args : { ...args };

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
    const args = spreadArgs(options.args);
    const result = await action.handler(args, {
      ...options.context,
      log: conditionalLogger(action, options),
    });
    return [result, action, options];
  } catch (err) {
    return options.onItemError(err, action, options);
  }
};

const runActionSync = (action, options) => {
  logAction('run (sync)', action);
  try {
    traceAction(action, options);
    const args = spreadArgs(options.args);
    // console.log('@callSync');
    const result = action.handler(args, {
      ...options.context,
      log: conditionalLogger(action, options),
    });
    return [result, action, options];
  } catch (err) {
    return options.onItemError(err, action, options);
  }
};

module.exports = { runAction, runActionSync };
