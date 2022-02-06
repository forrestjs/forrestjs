const { traceHook, logTrace, logBoot } = require('./tracer');
const { createHook, createAction } = require('./create-action');
const { registerAction } = require('./register-action');
const { createHookApp, runHookApp } = require('./create-hook-app');
const { createHookContext } = require('./create-hook-context');
const { getHook } = require('./create-hooks-registry');
const constants = require('./constants');

// DEPRECATED: to remove in v5.0.0
// Temporary hack to rename "createHook" -> "runHook"
const runHookDeprecate = `[DEPRECATED] runHook is deprecated and will be removed in next major version (v5.0.0)`;
const runHook = (...args) => {
  console.warn(runHookDeprecate);
  return createHook(...args);
};
runHook.sync = (...args) => {
  console.warn(runHookDeprecate);
  return createHook.sync(...args);
};
runHook.serie = (...args) => {
  console.warn(runHookDeprecate);
  return createHook.serie(...args);
};
runHook.parallel = (...args) => {
  console.warn(runHookDeprecate);
  return createHook.parallel(...args);
};
runHook.waterfall = (...args) => {
  console.warn(runHookDeprecate);
  return createHook.waterfall(...args);
};

// 4.1.0 renaming of the "runHookApp" API
const run = runHookApp;
run.run = run;

// Export the old API
run.traceHook = traceHook;
run.logTrace = logTrace;
run.logBoot = logBoot;
run.createAction = createAction;
run.registerAction = registerAction;
run.createHook = createHook; // DEPRECATED: to remove in v5.0.0
run.runHook = runHook; // DEPRECATED: to remove in v5.0.0
run.createHookContext = createHookContext; // DEPRECATED: to remove in v5.0.0

// DEPRECATED: Remove in v5.0.0
run.createHookApp = (...args) => {
  console.warn(
    '[DEPRECATED] `createHookApp()` is deprecated in favour of `forrestjs.create()` and will be remove in next major version 5.0.0',
  );
  return createHookApp(...args);
};
run.getHook = getHook;
// DEPRECATED: Remove in v5.0.0
run.runHookApp = (...args) => {
  console.warn(
    '[DEPRECATED] `runHookApp()` is deprecated in favour of `forrestjs.run()` and will be remove in next major version 5.0.0',
  );
  return runHookApp(...args);
};

// Export the internal constants
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
