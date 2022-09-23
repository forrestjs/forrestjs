const { traceHook, logTrace, logBoot } = require('./tracer');
const { createAction, createExtension } = require('./create-extension');
const { registerAction } = require('./register-action');
const { createApp, startApp } = require('./create-app');

const { getTarget } = require('./create-targets-registry');
const constants = require('./constants');

// Export the global symbol as App runner:
startApp.run = startApp;

// Export global API:
startApp.createApp = createApp;
startApp.traceHook = traceHook;
startApp.logTrace = logTrace;
startApp.logBoot = logBoot;
startApp.createAction = createAction;
startApp.registerAction = registerAction;
startApp.getTarget = getTarget;
startApp.createExtension = createExtension;

// Export the internal constants:
startApp.CORE = constants.CORE;
startApp.BOOT = constants.BOOT;
startApp.SERVICE = constants.SERVICE;
startApp.FEATURE = constants.FEATURE;
startApp.SYMBOLS = constants.SYMBOLS;
startApp.SEPARATOR = constants.SEPARATOR;
startApp.START = constants.START;
startApp.SETTINGS = constants.SETTINGS;
startApp.INIT_SERVICE = constants.INIT_SERVICE;
startApp.INIT_SERVICES = constants.INIT_SERVICES;
startApp.INIT_FEATURE = constants.INIT_FEATURE;
startApp.INIT_FEATURES = constants.INIT_FEATURES;
startApp.START_SERVICE = constants.START_SERVICE;
startApp.START_SERVICES = constants.START_SERVICES;
startApp.START_FEATURE = constants.START_FEATURE;
startApp.START_FEATURES = constants.START_FEATURES;
startApp.FINISH = constants.FINISH;

module.exports = startApp;
