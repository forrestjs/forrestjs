import { createServer } from 'http'
import express from 'express'
// import compression from 'compression'
// import helmet from 'helmet'
import { createHookContext } from '@forrestjs/hooks'
// import { INIT_SERVICE, START_SERVICE } from '@forrestjs/hooks'
// import { logInfo } from '@forrestjs/service-logger'
// import { EXPRESS_INIT, EXPRESS_MIDDLEWARE, EXPRESS_ROUTE, EXPRESS_HANDLER } from './hooks'
import * as hooks from './hooks'

// const app = express()
// const server = createServer(app)
const FALLBACK_PORT = '8080'

// export const init = async (settings) => {
//     logInfo('[express] init...')

//     await createHook(EXPRESS_INIT, {
//         async: 'serie',
//         args: { app, server, settings: { ...settings } },
//     })

//     // Basic middlewares
//     app.use(compression())
//     app.use(helmet())

//     // hook - enable a tracing context that is scoped
//     // into the current request
//     app.use(createHookContext(settings.hooks || {}))

//     // classic "data" middleware
//     app.use((req, res, next) => {
//         req.data = {}
//         next()
//     })

//     await createHook(EXPRESS_MIDDLEWARE, {
//         async: 'serie',
//         args: { app, server, settings: { ...settings } },
//     })

//     await createHook(EXPRESS_ROUTE, {
//         async: 'serie',
//         args: { app, server, settings: { ...settings } },
//     })

//     await createHook(EXPRESS_HANDLER, {
//         async: 'serie',
//         args: { app, server, settings: { ...settings } },
//     })
// }

// export const start = (settings) => new Promise((resolve) => {
//     logInfo('[express] start server...')
//     const port = settings.port || process.env.REACT_APP_PORT || process.env.PORT || fallbackPort
//     server.listen(port, () => {
//         logInfo(`[express] server is running on ${port}`)
//         resolve()
//     })
// })

export default ({ registerAction, getHook, registerHook }) => {
    // Register extension points
    registerHook(hooks)

    // Global Express App Context
    const app = express()
    const server = createServer(app)

    // Hooks helper functions
    const registerMiddleware = (a, b) => typeof a === 'string' ? app.use(a, b) : app.use(a)
    const registerHandler = fn => app.use(fn)
    const registerRoute = (method, mountPoint, chain) => app[method](mountPoint, chain)
    registerRoute.get = (a, b) => registerRoute('get', a, b)
    registerRoute.post = (a, b) => registerRoute('post', a, b)
    registerRoute.put = (a, b) => registerRoute('put', a, b)
    registerRoute.delete = (a, b) => registerRoute('delete', a, b)

    // Setup the Express App
    registerAction({
        hook: getHook('INIT_SERVICE'),
        name: hooks.SERVICE_NAME,
        trace: __filename,
        handler: async ({ createHook, getConfig }, ctx) => {
            const logVerbose = ctx.logVerbose || console.log

            // hook - enable a tracing context that is scoped into the current request
            app.use(createHookContext(getConfig('express.hooks', {})))
            
            logVerbose('[express] init')
            await createHook.serie(hooks.EXPRESS_HACKS_BEFORE, { app, server })
            
            logVerbose('[express] load middlewares')
            await createHook.serie(hooks.EXPRESS_MIDDLEWARE, { registerMiddleware })

            logVerbose('[express] load routes')
            await createHook.serie(hooks.EXPRESS_ROUTE, { registerRoute })
            
            logVerbose('[express] load handlers')
            await createHook.serie(hooks.EXPRESS_HANDLER, { registerHandler })

            logVerbose('[express] after init')
            await createHook.serie(hooks.EXPRESS_HACKS_AFTER, { app, server })
        },
    })

    // Start the Express App
    registerAction({
        hook: getHook('START_SERVICE'),
        name: hooks.SERVICE_NAME,
        trace: __filename,
        handler: ({ getConfig }, ctx) => new Promise((resolve, reject) => {
            const logInfo = ctx.logInfo || console.log
            const port = getConfig('express.port', process.env.REACT_APP_PORT || process.env.PORT || FALLBACK_PORT)
            server.listen(port, () => {
                logInfo(`[express] server is running on ${port}`)
                resolve()
            })
        }),
    })
}

