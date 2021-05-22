const { traceAction } = require('./tracer');
const { logAction } = require('./logger');

const scalars = ['number', 'string', 'boolean'];

const spreadArgs = (args) =>
  scalars.includes(typeof args) ? args : { ...args };

const runAction = async (action, options) => {
  logAction('run', action);
  try {
    traceAction(action, options);
    const args = spreadArgs(options.args);
    const result = await action.handler(args, options.context);
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
    const result = action.handler(args, options.context);
    return [result, action, options];
  } catch (err) {
    return options.onItemError(err, action, options);
  }
};

module.exports = { runAction, runActionSync };
