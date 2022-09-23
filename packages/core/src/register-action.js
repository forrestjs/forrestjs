/**
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

const noop = () => {};

const registerAction = ({
  name = '',
  trace = 'unknown',
  target = '',
  handler = noop,
  priority = 0,
  optional = false,
  ...meta
} = {}) => {
  if (!target || target === '') {
    throw new Error('Extensions must declare a "target" property!');
  }

  if (!handler || handler === noop) {
    throw new Error('Extensions must declare a "handler" property!');
  }

  const handlerFn = typeof handler === 'function' ? handler : () => handler;

  // Targets name can be expressed as variables:
  // '$FOO'  - required reference
  // '$FOO?' - optional reference
  try {
    const targetValue =
      target.substr(0, 1) === '$' ? getTarget(target.substr(1)) : target;

    // the target could be null in case of an optional reference was required
    // '$FOO?'
    if (targetValue === null) {
      return;
    }

    const actionName =
      false ||
      name ||
      (handlerFn.name !== 'handler' ? handlerFn.name : 'unknown');

    const actionPayload = {
      enabled: true,
      hook: targetValue, // TODO: why still hook here? test fails if changed to "target"
      name: actionName,
      trace,
      meta,
      handler: handlerFn,
      priority,
      optional,
    };

    logAction('register', actionPayload);
    appendAction(targetValue, actionPayload);

    // An optional target fails silently
  } catch (err) {
    if (!optional) {
      throw new ForrestJSRegisterActionError(err.message, {
        name,
        target: target,
        trace,
      });
    }
  }
};

module.exports = {
  registerAction,
};
