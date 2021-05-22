/**
 * // Array form
 * registerAction([ hook, handler, { name: 'xxx', ...} ])
 *
 * // Object form
 * registerAction({
 *   hook: SETTINGS,
 *   handler: () => {},
 *   name: ...
 * })
 */

const { appendAction } = require('./state');
const { logAction } = require('./logger');
const { getHook } = require('./create-hooks-registry');

const registerAction = (
  payload = {},
  receivedHandler = null,
  receivedOptions = {},
) => {
  // (name, handler, options)
  if (typeof payload === 'string') {
    return registerAction({
      ...receivedOptions,
      hook: payload,
      handler: receivedHandler,
    });
  }

  // ([ name, handler, options ])
  if (Array.isArray(payload)) {
    return registerAction({
      ...(payload[2] || {}),
      hook: payload[0],
      handler: payload[1],
    });
  }

  // ({ hook: 'xxx', handler: () => {}, ...options })
  // "handler" can also be a scalar value and is going to be replaces into a function.
  const {
    hook: receivedHook,
    name,
    trace,
    handler: receivedPayloadHandler,
    priority,
    ...meta
  } = payload;
  if (!receivedHook) {
    throw new Error('[hooks] actions must have a "hook" property!');
  }

  if (!receivedPayloadHandler) {
    throw new Error(
      '[hooks] actions must have a "handler" property as fuction!',
    );
  }

  const handler =
    typeof receivedPayloadHandler === 'function'
      ? receivedPayloadHandler
      : () => receivedPayloadHandler;

  // Hooks name can be expressed as variables:
  // '$FOO'  - required reference
  // '$FOO?' - optional reference
  try {
    const hook =
      receivedHook.substr(0, 1) === '$'
        ? getHook(receivedHook.substr(1))
        : receivedHook;

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
    if (!payload.optional) {
      throw err;
    }
  }
};

module.exports = { registerAction };
