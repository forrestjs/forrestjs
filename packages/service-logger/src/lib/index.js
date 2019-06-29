import { START } from '@forrestjs/hooks'
import winston from 'winston'
import * as hooks from './hooks'

// Keep a global instance and expose direct methods to log into
// the default logger
let logger = null
export const logError = (...args) => logger.error.call(logger, args)
export const logWarn = (...args) => logger.warn.call(logger, args)
export const logInfo = (...args) => logger.info.call(logger, args)
export const logVerbose = (...args) => logger.verbose.call(logger, args)
export const logDebug = (...args) => logger.debug.call(logger, args)
export const logSilly = (...args) => logger.silly.call(logger, args)

export default ({ registerAction, registerHook }) => {
    registerHook(hooks)
    registerAction({
        hook: START,
        name: hooks.SERVICE_NAME,
        trace: __filename,
        handler: ({ getConfig }, ctx) => {
            // Let other extensions configure the transports
            const transports = []
            const registerTransport = $ => transports.push($)
            ctx.createHook.serie(hooks.LOGGER_TRANSPORTS, { winston, registerTransport })

            // Add default console transports in case nothing got added
            if (!transports.length) {
                transports.push(new winston.transports.Console({
                    format: winston.format.simple()
                }))
            }

            // Create the logger instance
            ctx.logger = logger = winston.createLogger({
                level: getConfig('logger.level', process.env.LOG_LEVEL || 'info'),
                transports,
            })

            // Decorate the execution context with the log helpers
            ctx.logError = logError
            ctx.logWarn = logWarn
            ctx.logInfo = logInfo
            ctx.logVerbose = logVerbose
            ctx.logDebug = logDebug
            ctx.logSilly = logSilly
        },
    })
}