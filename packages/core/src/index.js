const { traceHook, logTrace, logBoot } = require('./tracer');
const {
  createHook,
  createAction,
  createExtension,
} = require('./create-extension');
const { registerAction } = require('./register-action');
const {
  createApp,
  startApp,
  createHookApp,
  runHookApp,
} = require('./create-app');
// const { createHookContext } = require('./create-hook-context');
const { getHook, getAction, getTarget } = require('./create-targets-registry');
const constants = require('./constants');

// DEPRECATED: to remove in v5.0.0
// Temporary hack to rename "createHook" -> "runHook"
// const runHookDeprecate = `[DEPRECATED] runHook is deprecated and will be removed in next major version (v5.0.0)`;
// const runHook = (...args) => {
//   console.warn(runHookDeprecate);
//   return createHook(...args);
// };
// runHook.sync = (...args) => {
//   console.warn(runHookDeprecate);
//   return createHook.sync(...args);
// };
// runHook.serie = (...args) => {
//   console.warn(runHookDeprecate);
//   return createHook.serie(...args);
// };
// runHook.parallel = (...args) => {
//   console.warn(runHookDeprecate);
//   return createHook.parallel(...args);
// };
// runHook.waterfall = (...args) => {
//   console.warn(runHookDeprecate);
//   return createHook.waterfall(...args);
// };

// Export the global symbol as App runner:
const run = startApp;
run.run = run;

// Export global API:
run.createApp = createApp;
run.traceHook = traceHook;
run.logTrace = logTrace;
run.logBoot = logBoot;
run.createAction = createAction;
run.registerAction = registerAction;
run.getTarget = getTarget;
run.createExtension = createExtension;

// DEPRECATED APIs: remove in v5.0.0
// run.createHook = createHook; // DEPRECATED: to remove in v5.0.0
// run.runHook = runHook; // DEPRECATED: to remove in v5.0.0
// // run.createHookContext = createHookContext; // DEPRECATED: to remove in v5.0.0
// run.createHookApp = createHookApp; // DEPRECATED: remove in v5.0.0
// run.getHook = getHook; // DEPRECATED: remove in v5.0.0
// run.getAction = getAction; // DEPRECATED: remove in v5.0.0
// run.runHookApp = runHookApp; // DEPRECATED: remove in v5.0.0

// Export the internal constants:
run.CORE = constants.CORE;
run.BOOT = constants.BOOT;
run.SERVICE = constants.SERVICE;
run.FEATURE = constants.FEATURE;
run.SYMBOLS = constants.SYMBOLS;
run.SEPARATOR = constants.SEPARATOR;
run.START = constants.START;
run.SETTINGS = constants.SETTINGS;
run.INIT_SERVICE = constants.INIT_SERVICE;
run.INIT_SERVICES = constants.INIT_SERVICES;
run.INIT_FEATURE = constants.INIT_FEATURE;
run.INIT_FEATURES = constants.INIT_FEATURES;
run.START_SERVICE = constants.START_SERVICE;
run.START_SERVICES = constants.START_SERVICES;
run.START_FEATURE = constants.START_FEATURE;
run.START_FEATURES = constants.START_FEATURES;
run.FINISH = constants.FINISH;

module.exports = run;
