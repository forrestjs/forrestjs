import { traceAction } from './tracer'
import { logAction } from './logger'

export const runAction = async (action, options) => {
    logAction('run', action)
    try {
        traceAction(action, options)
        const result = await action.handler({ ...options.args }, options.context)
        return [ result, action, options ]
    } catch (err) {
        return options.onItemError(err, action, options)
    }
}

export const runActionSync = (action, options) => {
    logAction('run (sync)', action)
    try {
        traceAction(action, options)
        const result = action.handler({ ...options.args }, options.context)
        return [ result, action, options ]
    } catch (err) {
        return options.onItemError(err, action, options)
    }
}
