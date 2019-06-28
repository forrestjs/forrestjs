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

import { appendAction } from './state'
import { logAction } from './logger'

export const registerAction = (payload = {}, receivedHandler = null, receivedOptions = {}) => {
    // (name, handler, options)
    if (typeof payload === 'string') {
        return registerAction({
            ...receivedOptions,
            hook: payload,
            handler: receivedHandler,
        })
    }

    // ([ name, handler, options ])
    if (Array.isArray(payload)) {
        return registerAction({
            ...(payload[2] || {}),
            hook: payload[0],
            handler: payload[1],
        })
    }

    // ({ hook: 'xxx', handler: () => {}, ...options })
    const { hook, name, trace, handler, priority, ...meta } = payload
    if (!hook) {
        throw new Error('[hooks] actions must have a "hook" property!')
    }
    if (!handler || typeof handler !== 'function') {
        throw new Error('[hooks] actions must have a "handler" property as fuction!')
    }

    const actionName = false
        || name
        || (handler.name !== 'handler' ? handler.name : 'unknown')

    const actionPayload = {
        enabled: true,
        hook,
        name: actionName,
        trace: trace || 'unknown',
        meta,
        handler,
        priority: priority || 0,
    }

    logAction('register', actionPayload)
    appendAction(hook, actionPayload)
}
