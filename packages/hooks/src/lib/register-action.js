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
import { getHook } from './create-hooks-registry'

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
    const { hook: receivedHook, name, trace, handler, priority, ...meta } = payload
    if (!receivedHook) {
        throw new Error('[hooks] actions must have a "hook" property!')
    }

    if (!handler || typeof handler !== 'function') {
        throw new Error('[hooks] actions must have a "handler" property as fuction!')
    }
    
    // Hooks name can be expressed as variables:
    // '$FOO'
    try {
        const hook = receivedHook.substr(0, 1) === '$'
            ? getHook(receivedHook.substr(1))
            : receivedHook

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

    // An optional hook fails silently
    } catch (err) {
        if (!payload.optional) {
            throw err
        }
    }
}
