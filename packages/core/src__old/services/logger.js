import { START, SERVICE } from '@marcopeg/hooks'
import { init, logError, logInfo, logVerbose, logDebug } from '@marcopeg/utils/lib/logger'
export { logError, logInfo, logVerbose, logDebug } from '@marcopeg/utils/lib/logger'

// Hooks from other services
const EXPRESS_MIDDLEWARE = `${SERVICE} express/middleware`

const expressMiddleware = (req, res, next) => {
    req.logger = {
        logError,
        logInfo,
        logVerbose,
        logDebug,
    }
    next()
}

export const register = ({ registerAction }) => {
    registerAction({
        hook: START,
        name: `${SERVICE} logger`,
        trace: __filename,
        handler: init,
    })

    registerAction({
        hook: EXPRESS_MIDDLEWARE,
        name: `${SERVICE} logger`,
        trace: __filename,
        handler: ({ app }) => app.use(expressMiddleware),
    })
}
