import { appendAction } from './state'
import { logAction } from './logger'

export const registerAction = (payload = {}) => {
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
