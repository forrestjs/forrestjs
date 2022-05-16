/**
 * // Array form
 * registerAction([ target, handler, { name: 'xxx', ...} ])
 *
 * // Object form
 * registerAction({
 *   target: SETTINGS,
 *   handler: () => {},
 *   name: ...
 * })
 */

const { appendAction } = require('./state');
const { logAction } = require('./logger');
const { getTarget } = require('./create-targets-registry');
const { ForrestJSRegisterActionError } = require('./errors');

const registerAction = (__arg1 = {}, __arg2 = null, __arg3 = {}) => {
  // (name, handler, options)
  if (typeof __arg1 === 'string') {
    console.warn(
      `[DEPRECATED] "registerAction(name, handler, option)" is deprecated and will be remove in version 5.x.`,
    );

    return registerAction({
      ...__arg3,
      target: __arg1,
      handler: __arg2,
    });
  }

  // ([ name, handler, options ])
  if (Array.isArray(__arg1)) {
    console.warn(
      `[DEPRECATED] "registerAction([name, handler, option])" is deprecated and will be remove in version 5.x.`,
    );
    return registerAction({
      ...(__arg1[2] || {}),
      target: __arg1[0],
      handler: __arg1[1],
    });
  }

  // ({ to: 'xxx', handler: () => {}, ...options })
  // "handler" can also be a scalar value and is going to be replaces into a function.
  const {
    hook: deprecatedReceivedHook, // DEPRECATER: will be removed in v5.0.0
    target: receivedTarget,
    // action,
    name,
    trace,
    handler: receivedHandler,
    priority,
    ...meta
  } = __arg1;

  // Backward compatibility until v5.0.0
  const targetAction = receivedTarget || deprecatedReceivedHook;

  if (!targetAction) {
    throw new Error('Extensions must declare a "target" property!');
  }

  if (!receivedHandler) {
    throw new Error('Extensions must declare a "handler" property!');
  }

  if (deprecatedReceivedHook) {
    console.warn(
      '[DEPRECATED] The "hook" property is deprecated and will be removed in v5.0.0\nUse "target" instead.',
    );
  }

  const handler =
    typeof receivedHandler === 'function'
      ? receivedHandler
      : () => receivedHandler;

  // Hooks name can be expressed as variables:
  // '$FOO'  - required reference
  // '$FOO?' - optional reference
  try {
    const hook =
      targetAction.substr(0, 1) === '$'
        ? getTarget(targetAction.substr(1))
        : targetAction;

    // the hook could be null in case of an optional reference was required
    // '$FOO?'
    if (hook === null) {
      return;
    }

    const actionName =
      false || name || (handler.name !== 'handler' ? handler.name : 'unknown');

    const actionPayload = {
      enabled: true,
      hook,
      name: actionName,
      trace: trace || 'unknown',
      meta,
      handler,
      priority: priority || 0,
    };

    logAction('register', actionPayload);
    appendAction(hook, actionPayload);

    // An optional hook fails silently
  } catch (err) {
    if (!__arg1.optional) {
      throw new ForrestJSRegisterActionError(err.message, {
        name,
        target: receivedTarget,
        trace,
      });
    }
  }
};

module.exports = {
  registerAction,
};
