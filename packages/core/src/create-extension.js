const { runAction, runActionSync } = require('./actions');
const { getState } = require('./state');
const { logTrace } = require('./tracer');
const { onItemError, ForrestJSCreateExtensionError } = require('./errors');
const { getTarget } = require('./create-targets-registry');

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

const createExtension = (receivedName, receivedOptions = {}) => {
  const { hooks, stack } = getState();

  if (!receivedName) {
    throw new Error(`createExtension() missing Extension name!`);
  }

  // Translate the received name into the final Extension Name
  let name = '';
  try {
    name =
      receivedName.substr(0, 1) === '$'
        ? getTarget(receivedName.substr(1))
        : receivedName;
  } catch (err) {
    throw new ForrestJSCreateExtensionError(err.message);
  }

  stack.push(name);
  const pullStack = (args) => {
    stack.pop();
    return args;
  };

  const options = {
    ...defaultOptions,
    ...receivedOptions,
  };

  // console.log('@@@@', name);

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
      // console.log('@@@@ PARALLEL', name);
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
      // console.log('@@@@ SERIE', name);
      try {
        const results = [];
        for (const action of actions) {
          // console.log('>>>', action);
          results.push(await runAction(action, options));
        }
        writeLog();
        pullStack();
        resolve(results);
      } catch (err) {
        // console.log('*****', err.name, err.message);
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
    // console.log('@@@@ WATERFALL', name);
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
    // console.log('@@@@ SYNC', name);
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

createExtension.sync = (name, args, context) =>
  createExtension(name, { args, context, mode: 'sync' });

createExtension.serie = (name, args, context) =>
  createExtension(name, { args, context, mode: 'serie' });

createExtension.parallel = (name, args, context) =>
  createExtension(name, { args, context, mode: 'parallel' });

createExtension.waterfall = (name, args, context) =>
  createExtension(name, { args, context, mode: 'waterfall' });

module.exports = { createExtension };
