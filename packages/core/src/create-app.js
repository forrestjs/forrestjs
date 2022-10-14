const dotted = require('@marcopeg/dotted').default;
const { createExtension } = require('./create-extension');
const { registerAction } = require('./register-action');
const { traceHook } = require('./tracer');
const { createRegistry } = require('./create-targets-registry');
const constants = require('./constants');
const { makeLogger, LOG_LEVELS } = require('./logger');
const {
  ForrestJSGetConfigError,
  ForrestJSGetContextError,
  ForrestJSInvalidTargetError,
  ForrestJSInvalidHandlerError,
} = require('./errors');

const isDeclarativeAction = (
  { target, handler },
  integrationName,
  integrationType,
) => {
  if (!(typeof target === 'string' && target)) {
    throw new ForrestJSInvalidTargetError(
      `${integrationType} "${integrationName}" defines an invalid target "${target}"`,
    );
  }

  if (!(typeof handler === 'object' || typeof handler === 'function')) {
    throw new ForrestJSInvalidHandlerError(
      `${integrationType} "${integrationName}" defines an invalid handler`,
    );
  }

  return true;
};

const isListOfDeclarativeActions = (list, integrationName, integrationType) =>
  Array.isArray(list) &&
  list.every(($) => isDeclarativeAction($, integrationName, integrationType));

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
const runIntegrations = async (
  integrations,
  context,
  prefix = '',
  integrationType = 'Integration',
) => {
  const registeredExtensions = [];

  // Execute the integration functions
  for (const service of integrations) {
    // Process different styles of registering services
    const registerFn = service.register || service.default || service;
    const integrationName = registerFn.name || service.name;

    // Try to execute the register function, providing a registerAction
    // function that is able to use the function's name as feature name
    // That will reduce the need for using the property "name" during
    // the registration of the features
    // const registerExtension = ;
    const computed =
      typeof registerFn === 'function'
        ? await registerFn({
            ...context,
            registerAction: ({ name, ...config }) =>
              registeredExtensions.push({
                ...config,
                name: `${prefix}${name || integrationName}`,
              }),
          })
        : service;

    // Register a list of hooks in a declarative way:
    // [ { hook, handler, ... }, { ... }]
    if (
      isListOfDeclarativeActions(computed, integrationName, integrationType)
    ) {
      computed.forEach((item) =>
        registeredExtensions.push({
          ...item,
          name: `${prefix}${item.name || integrationName}`,
        }),
      );
    }

    // register a single action give an a configuration object
    // { target, handler, ... }
    else if (computed && computed.target && computed.handler) {
      // Strict check on the action format:
      isDeclarativeAction(computed, integrationName, integrationType);

      registeredExtensions.push({
        ...computed,
        name: `${prefix}${computed.name || integrationName}`,
      });
    }
  }
  // Register all the actions declared by the integrations that have been executed
  registeredExtensions.forEach(context.registerAction);
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

const registerSettingsExtension = (buildAppSettings) => {
  registerAction({
    name: `${constants.BOOT} app/settings`,
    target: constants.SETTINGS,
    handler: async (ctx) => {
      const values = await buildAppSettings(ctx, ctx);
      values &&
        Object.keys(values).forEach((key) => ctx.setConfig(key, values[key]));
    },
  });
  return {};
};

/**
 * Creates a ForrestJS App
 *
 * @param {ForrestJSApp} appManifest
 * @returns {Promise}
 */
const createApp =
  ({
    services = [],
    features = [],
    settings = {},
    context = {},
    trace = null,
    logLevel = process.env.LOG_LEVEL || 'info',
  } = {}) =>
  async () => {
    // creates initial internal settings from an object
    // or automatically register the provided settings callback
    const computedSettings =
      typeof settings === 'function'
        ? registerSettingsExtension(settings)
        : settings;

    // Decorates the application settings with the logger
    // configuration
    const internalSettings = {
      ...computedSettings,
      // Provide default logging settings:
      logger: {
        level: logLevel,
        levelsMap: LOG_LEVELS,
        transport: console.log,
        ...(computedSettings.logger || {}),
      },
    };

    // Context bound list of known Extensions
    const targetsRegistry = createRegistry(constants);

    /**
     * Retrieve a configuration value
     * @param  {string} key path to the config value
     * @param  {?any} defaultValue
     * @returns {any}
     */
    const getConfig = (...args) => {
      try {
        return objectGetter(internalSettings)(...args);
      } catch (err) {
        throw new ForrestJSGetConfigError(err.message);
      }
    };

    const setConfig = objectSetter(internalSettings);

    // create the context with getters / setters /
    const internalContext = {
      // Add basic logging mechanism
      // (could be replaced by extensions)
      log: makeLogger(internalSettings.logger.level, {
        levelsMap: internalSettings.logger.levelsMap,
        transport: internalSettings.logger.transport,
      }),
      ...context,
      ...targetsRegistry,
      registerAction,
      setConfig,
      getConfig,
      setContext: null,
      getContext: null,
      createExtension: null,
    };

    // provide an api to deal with the internal context
    internalContext.getContext = (...args) => {
      try {
        return objectGetter(internalContext)(...args);
      } catch (err) {
        throw new ForrestJSGetContextError(err.message);
      }
    };
    internalContext.setContext = objectSetter(internalContext);

    // createExtension scoped to the App context
    const _cs = (name, args) =>
      createExtension(name, { ...args, context: internalContext });
    _cs.sync = (name, args) => _cs(name, { args, mode: 'sync' });
    _cs.serie = (name, args) => _cs(name, { args, mode: 'serie' });
    _cs.parallel = (name, args) => _cs(name, { args, mode: 'parallel' });
    _cs.waterfall = (name, args) => _cs(name, { args, mode: 'waterfall' });

    // Inject into the App context
    internalContext.createExtension = _cs;

    // run lifecycle
    await runIntegrations(
      services,
      internalContext,
      `${constants.SERVICE} `,
      'Service',
    );
    await _cs.serie(constants.START, internalContext);
    await _cs.serie(constants.SETTINGS, internalContext);
    await runIntegrations(
      features,
      internalContext,
      `${constants.FEATURE} `,
      'Feature',
    );
    await _cs.parallel(constants.INIT_SERVICES, internalContext);
    await _cs.serie(constants.INIT_SERVICE, internalContext);
    await _cs.parallel(constants.INIT_FEATURES, internalContext);
    await _cs.serie(constants.INIT_FEATURE, internalContext);
    await _cs.parallel(constants.START_SERVICES, internalContext);
    await _cs.serie(constants.START_SERVICE, internalContext);
    await _cs.parallel(constants.START_FEATURES, internalContext);
    await _cs.serie(constants.START_FEATURE, internalContext);
    await _cs.serie(constants.FINISH, internalContext);

    // Implement trace without a Hook
    // TODO: move before the execution
    if (trace) {
      const lines = [];
      lines.push('');
      lines.push('=================');
      lines.push('Boot Trace:');
      lines.push('=================');
      lines.push('');
      switch (trace) {
        case 'full':
          lines.push(traceHook()('full')('json'));
          break;
        default:
          lines.push(traceHook()('compact')('cli').join('\n'));
          break;
      }
      lines.push('');
      lines.push('');

      console.log(lines.join('\n'));
    }

    return {
      settings: internalSettings,
      context: internalContext,
    };
  };

const startApp = ({
  services = [],
  features = [],
  settings = {},
  context = {},
  trace = null,
  logLevel,
} = {}) => {
  const app = createApp({
    services,
    features,
    settings,
    context,
    trace,
    logLevel,
  });
  return app();
};

module.exports = {
  createApp,
  startApp,
  isDeclarativeAction,
  isListOfDeclarativeActions,
};
