import { appendAction } from './state'
import { logAction } from './logger'

const __registerAction = (payload = {}) => {
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


export const registerAction = (name, payload = {}) => {
    // deprecation
    if (typeof name === 'object') {
        return __registerAction(name)
    } else {
        console.log('[hooks] deprecated signature since v0.0.20 - will be removed in v1.0.0')
        console.log('[hooks] use registerAction({ name, hook, handler, ... })')
    }
    
    const { action, trace, handler, priority, ...meta } = payload
    if (!name) {
        throw new Error('[hook] handlers must have a "name" property!')
    }
    if (!handler || typeof handler !== 'function') {
        throw new Error('[hook] handlers must have a "handler" property as fuction!')
    }

    const actionName = false
        || action
        || (handler.name !== 'handler' ? handler.name : 'unknown')

    const actionPayload = {
        enabled: true,
        hook: name,
        name: actionName,
        trace: trace || 'unknown',
        meta,
        handler,
        priority: priority || 0,
    }

    logAction('register', actionPayload)
    appendAction(name, actionPayload)
}
