const dotted = require('@marcopeg/dotted').default;
const { createAction } = require('./create-action');
const { registerAction } = require('./register-action');
const { traceHook } = require('./tracer');
const { createHooksRegistry } = require('./create-hooks-registry');
const constants = require('./constants');

// DEPRECATED: property "hook" is deprecated and will be removed in v5.0.0
const isDeclarativeAction = ({ hook, action, handler }) =>
  (typeof hook === 'string' || typeof action === 'string') &&
  (typeof handler === 'object' || typeof handler === 'function');

const isListOfDeclarativeActions = (list) =>
  Array.isArray(list) && list.every(isDeclarativeAction);
/**
 * All the utilization of "registerAction" by an integration's
 * manifest will be queued into an in-memory store and applied only
 * after all the integration have fired.
 *
 * This lets each integration the possibility to use the `registerHook`
 * API and declare its own nominal hooks capabilities.
 *
 * This asynchronous behaviour allows service2service and feature2feature
 * extensibility without enforcing strict registration order.
 *
 * @param {*} integrations
 * @param {*} context
 * @param {*} prefix
 */
const runIntegrations = async (integrations, context, prefix = '') => {
  const registeredActions = [];

  // Execute the integration functions
  for (const service of integrations) {
    // Process different styles of registering services
    const registerFn = service.register || service.default || service;
    const integrationName = registerFn.name || service.name;

    // Try to execute the register function, providing a registerAction
    // function that is able to use the function's name as feature name
    // That will reduce the need for using the property "name" during
    // the registration of the features
    const computed =
      typeof registerFn === 'function'
        ? await registerFn({
            ...context,
            registerAction: (ag1, ag2, ag3 = {}) => {
              // Handle positional arguments:
              // registerAction('hook', () => {})
              // registerAction('hook', () => {}, 'name')
              // registerAction('hook', () => {}, { name: 'name' })
              if (typeof ag1 === 'string') {
                return registeredActions.push([
                  ag1,
                  ag2,
                  {
                    ...(typeof ag3 === 'string' ? { name: ag3 } : ag3),
                    name: `${prefix}${
                      (typeof ag3 === 'string' ? ag3 : ag3.name) ||
                      integrationName
                    }`,
                  },
                ]);
              }

              // Handle definition as an object
              return registeredActions.push({
                ...ag1,
                name: `${prefix}${ag1.name || integrationName}`,
              });
            },
          })
        : service;

    // Register a list of hooks in a declarative way:
    // [ { hook, handler, ... }, { ... }]
    if (isListOfDeclarativeActions(computed)) {
      computed.forEach((item) =>
        registeredActions.push({
          ...item,
          name: `${prefix}${item.name || integrationName}`,
        }),
      );
    }

    // DEPRECATED
    // register a single action given as configuration array
    // [ hook, handler, name ]
    // [ hook, handler, { otherOptions }]
    else if (
      Array.isArray(computed) &&
      computed.length >= 2 &&
      typeof computed[0] === 'string' &&
      (typeof computed[1] === 'function' || typeof computed[1] === 'object')
    ) {
      console.log(
        '[DEPRECATED] please use the object base declarative pattern { hook, handler, ... } - this API will be removed in v5.0.0',
      );
      const [hook, handler, options = {}] = computed;
      registeredActions.push({
        ...(typeof options === 'string'
          ? { name: `${prefix}${options}` }
          : {
              ...options,
              name: `${prefix}${options.name || integrationName}`,
            }),
        hook,
        // An handler could be a simple object to skip any running function
        handler: typeof handler === 'function' ? handler : () => handler,
      });
    }

    // register a single action give an a configuration object
    // { hook, handler, ... }
    // DEPRECATED: "hook" in favor for "action" - remove in v5.0.0
    else if (
      computed &&
      (computed.hook || computed.action) &&
      computed.handler
    ) {
      registeredActions.push({
        ...computed,
        name: `${prefix}${computed.name || integrationName}`,
      });
    }
  }

  // Register all the actions declared by the integrations that have been executed
  registeredActions.forEach((actionDef) => context.registerAction(actionDef));
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
              action: constants.SETTINGS,
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

    // createAction scoped to the ForrestJS App context
    const _createAction = (name, options) =>
      createAction(name, { ...options, context: internalContext });
    _createAction.sync = (name, args) => _createAction(name, { args });
    _createAction.serie = (name, args) =>
      _createAction(name, { args, mode: 'serie' });
    _createAction.parallel = (name, args) =>
      _createAction(name, { args, mode: 'parallel' });
    _createAction.waterfall = (name, args) =>
      _createAction(name, { args, mode: 'waterfall' });
    internalContext.createHook = _createAction;

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
    await runIntegrations(services, internalContext, `${constants.SERVICE} `);
    await _createAction.serie(constants.START, internalContext);
    await _createAction.serie(constants.SETTINGS, internalContext);
    await runIntegrations(features, internalContext, `${constants.FEATURE} `);
    await _createAction.parallel(constants.INIT_SERVICES, internalContext);
    await _createAction.serie(constants.INIT_SERVICE, internalContext);
    await _createAction.parallel(constants.INIT_FEATURES, internalContext);
    await _createAction.serie(constants.INIT_FEATURE, internalContext);
    await _createAction.parallel(constants.START_SERVICES, internalContext);
    await _createAction.serie(constants.START_SERVICE, internalContext);
    await _createAction.parallel(constants.START_FEATURES, internalContext);
    await _createAction.serie(constants.START_FEATURE, internalContext);
    await _createAction.serie(constants.FINISH, internalContext);

    return {
      settings: internalSettings,
      context: internalContext,
    };
  };

// Convenient method to skip the double function
const runHookApp = (...args) => createHookApp(...args)();

module.exports = {
  createHookApp,
  runHookApp,
  isDeclarativeAction,
  isListOfDeclarativeActions,
};
