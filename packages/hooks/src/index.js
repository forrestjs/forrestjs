const { traceHook, logTrace, logBoot } = require('./tracer');
const { createHook } = require('./create-hook');
const { registerAction } = require('./register-action');
const { createHookApp, runHookApp } = require('./create-hook-app');
const { createHookContext } = require('./create-hook-context');
const { getHook } = require('./create-hooks-registry');
const constants = require('./constants');

// Temporary hack to rename "createHook" -> "runHook"
const runHook = (...args) => createHook(...args);
runHook.sync = (...args) => createHook.sync(...args);
runHook.serie = (...args) => createHook.serie(...args);
runHook.parallel = (...args) => createHook.parallel(...args);
runHook.waterfall = (...args) => createHook.waterfall(...args);

module.exports = {
  traceHook,
  logTrace,
  logBoot,
  createHook,
  runHook,
  registerAction,
  createHookApp,
  runHookApp,
  createHookContext,
  getHook,
  ...constants,
};
