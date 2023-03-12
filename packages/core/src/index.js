const { traceHook, logTrace, logBoot } = require('./tracer');
const { createAction, createExtension } = require('./create-extension');
const { registerAction } = require('./register-action');
const { createApp, startApp } = require('./create-app');

const { getTarget } = require('./create-targets-registry');
const constants = require('./constants');

/**
 * @callback ForrestJSGetter
 * @param {string} key
 * @param {any} [defaultValue]
 * @returns {any}
 */

/**
 * @callback ForrestJSSetter
 * @param {string} key
 * @param {any} value
 * @returns {any}
 */

/**
 * @callback ForrestJSRegisterTargets
 * @param {Object} targets
 * @returns {void}
 */

/**
 * @typedef {Object} ForrestJSExtensionLog
 * @property {name} string
 * @property {hook} string
 * @property {priority} number
 * @property {trace} any
 * @property {boolean} enabled
 * @property {optional} enabled
 * @property {function} handler
 * @property {logLevel} string
 * @property {Object} meta
 */

/**
 * @typedef {Object} ForrestJSActionLog
 * @property {any} args
 * @property {ForrestJSContext} context
 * @property {string} mode
 * @property {function} onError
 * @property {function} onItemError
 * @property {any} trace
 */

/**
 * @callback ForrestJSCreateSyncExtension
 * @param {String} target
 * @param {Object} [params]
 * @returns {Array.<any, ForrestJSExtensionLog, ForrestJSActionLog>}
 */

/**
 * @callback ForrestJSCreateAsycExtension
 * @param {String} target
 * @param {Object} [params]
 * @returns {Promise}
 */

/**
 * @typedef {Object} ForrestJSCreateExtension
 * @property {ForrestJSCreateSyncExtension} sync
 * @property {ForrestJSCreateSyncExtension} waterfall
 * @property {ForrestJSCreateAsycExtension} serie
 * @property {ForrestJSCreateAsycExtension} parallel
 */

/**
 * @typedef {Object} ForrestJSLogger
 * @property {function} error
 * @property {function} warn
 * @property {function} info
 * @property {function} http
 * @property {function} verbose
 * @property {function} debug
 * @property {function} silly
 */

/**
 * @typedef {Object} ForrestJSContext
 * @property {ForrestJSLogger} log
 * @property {ForrestJSGetter} getConfig
 * @property {ForrestJSSetter} setConfig
 * @property {ForrestJSGetter} getContext
 * @property {ForrestJSSetter} setContext
 * @property {ForrestJSRegisterTargets} registerTargets
 * @property {ForrestJSCreateExtension} createExtension
 */

/**
 * @interface ForrestJSParams
 */

/**
 * @callback ForrestJSHandler
 * @param {ForrestJSParams} params
 * @param {ForrestJSContext} context
 * @returns {any}
 */

/**
 * @typedef {Object} ForrestJSExtension
 * @property {string} target
 * @property {ForrestJSHandler} handler
 * @property {boolean} [enabled]
 * @property {boolean} [optional]
 * @property {string} [name]
 * @property {string} [trace]
 * @property {string} [logLevel]
 * @property {Object} [meta]
 * @property {number} [priority]
 */

/**
 * @callback ForrestJSService
 * @param {ForrestJSContext} context
 * @returns {ForrestJSExtension|Array.<ForrestJSExtension>}
 */

/**
 * @callback ForrestJSFeature
 * @param {ForrestJSContext} context
 * @returns {ForrestJSExtension|Array.<ForrestJSExtension>}
 */

/**
 * @typedef {Object} ForrestJSAppManifest
 * @property {Array.<ForrestJSService|ForrestJSExtension>} [services = []]
 * @property {Array.<ForrestJSFeature|ForrestJSExtension>} [features = []]
 * @property {Object} [settings = {}]
 * @property {Object} [context = {}]
 * @property {string|null} [trace]
 * @property {string} [logLevel = 'info']
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
module.exports.run = run;

// exports.run = run;
// exports.run.run = run;
// // exports.default = run;

// Export global API:
module.exports.createApp = createApp;
module.exports.startApp = startApp;
module.exports.traceHook = traceHook;
module.exports.logTrace = logTrace;
module.exports.logBoot = logBoot;
module.exports.createAction = createAction;
module.exports.registerAction = registerAction;
module.exports.getTarget = getTarget;
module.exports.createExtension = createExtension;

// Export the internal constants:
module.exports.CORE = constants.CORE;
module.exports.BOOT = constants.BOOT;
module.exports.SERVICE = constants.SERVICE;
module.exports.FEATURE = constants.FEATURE;
module.exports.SYMBOLS = constants.SYMBOLS;
module.exports.SEPARATOR = constants.SEPARATOR;
module.exports.START = constants.START;
module.exports.SETTINGS = constants.SETTINGS;
module.exports.INIT_SERVICE = constants.INIT_SERVICE;
module.exports.INIT_SERVICES = constants.INIT_SERVICES;
module.exports.INIT_FEATURE = constants.INIT_FEATURE;
module.exports.INIT_FEATURES = constants.INIT_FEATURES;
module.exports.START_SERVICE = constants.START_SERVICE;
module.exports.START_SERVICES = constants.START_SERVICES;
module.exports.START_FEATURE = constants.START_FEATURE;
module.exports.START_FEATURES = constants.START_FEATURES;
module.exports.FINISH = constants.FINISH;

// module.exports = startApp;
