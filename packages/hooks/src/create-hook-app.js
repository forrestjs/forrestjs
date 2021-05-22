const dotted = require('@marcopeg/dotted').default;
const { createHook } = require('./create-hook');
const { registerAction } = require('./register-action');
const { traceHook } = require('./tracer');
const { createHooksRegistry } = require('./create-hooks-registry');
const constants = require('./constants');

const runIntegrations = async (integrations, context) => {
  for (const service of integrations) {
    let computed = null;

    // full module that exposes "register" as API
    if (service.register) {
      computed = await service.register(context);

      // ES6 export default support
    } else if (service.default) {
      computed = await service.default(context);

      // simple function that implements "register"
    } else if (typeof service === 'function') {
      computed = await service(context);
    }

    // try to use the result of a registering function as the
    // instructions how to register an extension
    computed = computed || service;

    // register a single action as a feature
    // [ hookName, handler, { otherOptions }]
    if (
      Array.isArray(computed) &&
      computed.length >= 2 &&
      typeof computed[0] === 'string' &&
      (typeof computed[1] === 'function' || typeof computed[1] === 'object')
    ) {
      const [hook, handler, options = {}] = computed;
      registerAction({
        ...(typeof options === 'string' ? { name: options } : options),
        hook,
        // An handler could be a simple object to skip any running function
        handler: typeof handler === 'function' ? handler : () => handler,
      });
    }
  }
};

const objectSetter = (targetObject) => (path, value) => {
  dotted.set(targetObject, path, value);
  return true;
};

const objectGetter = (targetObject) => (path, defaultValue) => {
  let value = undefined;
  try {
    value = dotted(targetObject, path);
  } catch (err) {}

  if (value !== undefined) {
    return value;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  throw new Error(`path "${path}" does not exists!`);
};

const createHookApp =
  (appDefinition = {}) =>
  async () => {
    // accepts a single param as [] of features
    const {
      services = [],
      features = [],
      settings = {},
      context = {},
      trace = null,
    } = Array.isArray(appDefinition)
      ? { features: appDefinition }
      : appDefinition;

    // creates initial internal settings from an object
    // or automatically register the provided settings callback
    const internalSettings =
      typeof settings === 'function'
        ? (() => {
            registerAction({
              name: `${constants.BOOT} app/settings`,
              hook: constants.SETTINGS,
              handler: async () => {
                const values = await settings(internalContext, internalContext);
                values &&
                  Object.keys(values).forEach((key) => {
                    internalSettings[key] = values[key];
                  });
              },
            });
            return {};
          })()
        : settings;

    // Context bound list of known hooks
    const hooksRegistry = createHooksRegistry(constants);

    // create getter and setter for the configuration
    const getConfig = objectGetter(internalSettings);
    const setConfig = objectSetter(internalSettings);

    // create the context with getters / setters /
    const internalContext = {
      ...context,
      ...hooksRegistry,
      registerAction,
      setConfig,
      getConfig,
      setContext: null,
      getContext: null,
    };

    // provide an api to deal with the internal context
    internalContext.getContext = objectGetter(internalContext);
    internalContext.setContext = objectSetter(internalContext);

    // createHook scoped to the Hook App context
    const scopedCreateHook = (name, options) =>
      createHook(name, { ...options, context: internalContext });
    scopedCreateHook.sync = (name, args) => scopedCreateHook(name, { args });
    scopedCreateHook.serie = (name, args) =>
      scopedCreateHook(name, { args, mode: 'serie' });
    scopedCreateHook.parallel = (name, args) =>
      scopedCreateHook(name, { args, mode: 'parallel' });
    scopedCreateHook.waterfall = (name, args) =>
      scopedCreateHook(name, { args, mode: 'waterfall' });
    internalContext.createHook = scopedCreateHook;

    if (trace) {
      registerAction({
        name: `${constants.BOOT} app/trace`,
        hook: constants.FINISH,
        handler: () => {
          console.log('');
          console.log('=================');
          console.log('Boot Trace:');
          console.log('=================');
          console.log('');
          switch (trace) {
            case 'full':
              console.log(traceHook()('full')('json'));
              break;
            default:
              console.log(traceHook()('compact')('cli').join('\n'));
              break;
          }
          console.log('');
          console.log('');
        },
      });
    }

    // run lifecycle
    await runIntegrations(services, internalContext);
    await scopedCreateHook.serie(constants.START, internalContext);
    await scopedCreateHook.serie(constants.SETTINGS, internalContext);
    await runIntegrations(features, internalContext);
    await scopedCreateHook.parallel(constants.INIT_SERVICES, internalContext);
    await scopedCreateHook.serie(constants.INIT_SERVICE, internalContext);
    await scopedCreateHook.parallel(constants.INIT_FEATURES, internalContext);
    await scopedCreateHook.serie(constants.INIT_FEATURE, internalContext);
    await scopedCreateHook.parallel(constants.START_SERVICES, internalContext);
    await scopedCreateHook.serie(constants.START_SERVICE, internalContext);
    await scopedCreateHook.parallel(constants.START_FEATURES, internalContext);
    await scopedCreateHook.serie(constants.START_FEATURE, internalContext);
    await scopedCreateHook.serie(constants.FINISH, internalContext);

    return {
      settings: internalSettings,
      context: internalContext,
    };
  };

// Convenient method to skip the double function
const runHookApp = (...args) => createHookApp(...args)();

module.exports = { createHookApp, runHookApp };
