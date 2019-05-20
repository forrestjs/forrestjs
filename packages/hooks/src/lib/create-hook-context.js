/**
 * ExpressJS Middleware
 *
 * creates a unique context name that can be used to trace request
 * related hooks.
 *
 * the entire trace gets removed after a while to keep memory under control.
 */

import { deleteTrace } from './state'
import { traceHook, logTrace } from './tracer'

let ctxCount = 0

export const createHookContext = (settings = {}) => (req, res, next) => {
    const namespace = settings.namespace || 'hooks'
    const expiry = settings.expiry || 5000
    const log = settings.logging || console.log
    const ctx = ctxCount++

    const hooks = {
        ctx,
        getTrace: traceHook(ctx),
        logTrace: showBoot => logTrace(log)(ctx)({
            title: req.originalUrl,
            showBoot,
        }),
    }
    
    // clean out request trace
    setTimeout(() => deleteTrace(ctx), expiry)

    req[namespace] = hooks
    next()
}
