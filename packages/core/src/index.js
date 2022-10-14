// const { traceHook, logTrace, logBoot } = require('./tracer');
// const { createAction, createExtension } = require('./create-extension');
// const { registerAction } = require('./register-action');
// const { createApp, startApp } = require('./create-app');
const { createApp } = require('./create-app');

// const { getTarget } = require('./create-targets-registry');
// const constants = require('./constants');

/**
 * @callback ForrestJSGetter
 * @param {string} key
 * @param {?any} defaultValue
 * @returns {any}
 */

/**
 * @typedef {Object} ForrestJSContext
 * @property {ForrestJSGetter} getConfig
 * @property {() => void} setConfig
 * @property {ForrestJSGetter} getContext
 * @property {() => void} setContext
 */

/**
 * @typedef {Object} ForrestJSExtension
 * @property {string} target
 * @property {() => vlid} handler
 */

/**
 * @callback ForrestJSHandler
 * @param {ForrestJSContext} target
 * @returns {Array.ForrestJSExtension}
 */

/**
 * @callback ForrestJSService
 * @param {ForrestJSContext} target
 * @returns {Array.ForrestJSExtension}
 */

/**
 * @callback ForrestJSFeature
 * @param {Object} target
 * @returns {Array.ForrestJSExtension}
 */

/**
 * @typedef {Object} ForrestJSAppManifest
 * @property {?Array.ForrestJSService} services
 * @property {?Array.ForrestJSFeature} features
 * @property {?Object} settings
 * @property {?Object} context
 * @property {?string|null} trace
 * @property {?string} logLevel
 */

/**
 * Executes a ForrestJS App
 *
 * @param {ForrestJSAppManifest} manifest
 * @returns {Promise}
 */

const run = ({
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

module.exports = run;

// Export global API:
// exports.createApp = createApp;
// exports.traceHook = traceHook;
// exports.logTrace = logTrace;
// exports.logBoot = logBoot;
// exports.createAction = createAction;
// exports.registerAction = registerAction;
// exports.getTarget = getTarget;
// exports.createExtension = createExtension;

// Export the internal constants:
// exports.CORE = constants.CORE;
// exports.BOOT = constants.BOOT;
// exports.SERVICE = constants.SERVICE;
// exports.FEATURE = constants.FEATURE;
// exports.SYMBOLS = constants.SYMBOLS;
// exports.SEPARATOR = constants.SEPARATOR;
// exports.START = constants.START;
// exports.SETTINGS = constants.SETTINGS;
// exports.INIT_SERVICE = constants.INIT_SERVICE;
// exports.INIT_SERVICES = constants.INIT_SERVICES;
// exports.INIT_FEATURE = constants.INIT_FEATURE;
// exports.INIT_FEATURES = constants.INIT_FEATURES;
// exports.START_SERVICE = constants.START_SERVICE;
// exports.START_SERVICES = constants.START_SERVICES;
// exports.START_FEATURE = constants.START_FEATURE;
// exports.START_FEATURES = constants.START_FEATURES;
// exports.FINISH = constants.FINISH;

// module.exports = startApp;
