const { runAction, runActionSync } = require('./actions');
const { getState } = require('./state');
const { logTrace } = require('./tracer');
const { onItemError } = require('./errors');

const defaultOptions = {
  mode: 'sync',
  args: null,
  trace: 'boot',
  context: {}, // pass down utilities into any registerd action
  onError: (err) => {
    throw err;
  },
  onItemError,
};

const createAction = (name, receivedOptions = {}) => {
  const { hooks, stack } = getState();

  stack.push(name);
  const pullStack = (args) => {
    stack.pop();
    return args;
  };

  const options = {
    ...defaultOptions,
    ...receivedOptions,
  };

  const actions = (hooks[name] || []).filter((h) => h.enabled === true);

  const writeLog = () => {
    if (options.logTrace) {
      logTrace(options.logTrace)(options.trace)({
        title: name,
      });
    }
  };

  if (options.mode === 'parallel') {
    return new Promise(async (resolve, reject) => {
      try {
        const promises = actions.map((action) => runAction(action, options));
        const results = await Promise.all(promises);
        writeLog();
        pullStack();
        resolve(results);
      } catch (err) {
        try {
          resolve(options.onError(err, name, options));
        } catch (err) {
          reject(err);
        } finally {
          pullStack();
        }
      }
    });
  }

  if (options.mode === 'serie') {
    return new Promise(async (resolve, reject) => {
      try {
        const results = [];
        for (const action of actions) {
          results.push(await runAction(action, options));
        }
        writeLog();
        pullStack();
        resolve(results);
      } catch (err) {
        try {
          resolve(options.onError(err, name, options));
        } catch (err) {
          reject(err);
        } finally {
          pullStack();
        }
      }
    });
  }

  // Edit the value of the args and return it for further iteration
  if (options.mode === 'waterfall') {
    const results = [];
    let args = options.args;

    actions.forEach((action) => {
      const res = runActionSync(action, { ...options, args });
      results.push(res);
      args = res[0];
    });

    return {
      value: args,
      results,
    };
  }

  // synchronous execution with arguments
  try {
    const results = actions.map((action) => runActionSync(action, options));
    writeLog();
    pullStack();
    return results;
  } catch (err) {
    return pullStack(options.onError(err, name, options));
  }
};

/**
 * Helpers Shortcuts
 */

createAction.sync = (name, args, context) =>
  createAction(name, { args, context, mode: 'sync' });

createAction.serie = (name, args, context) =>
  createAction(name, { args, context, mode: 'serie' });

createAction.parallel = (name, args, context) =>
  createAction(name, { args, context, mode: 'parallel' });

createAction.waterfall = (name, args, context) =>
  createAction(name, { args, context, mode: 'waterfall' });

/**
 * DEPRECATED API
 */
const createHookDeprecate =
  '[DEPRECATED] `createHook()` is deprecated and will be removed in next major version (v5.0.0)';

const createHook = (...args) => {
  console.warn(createHookDeprecate);
  return createAction(...args);
};

createHook.sync = createAction.sync;
createHook.serie = createAction.serie;
createHook.parallel = createAction.parallel;
createHook.waterfall = createAction.waterfall;

module.exports = { createHook, createAction };
