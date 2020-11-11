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

class MissingPropertyError extends Error {}

// Receives in "route" the return data structure from a "registerHook.sync" call.
const makeRoute = method => route => {
    if (Array.isArray(route[0])) {
      return [{
        method,
        url: route[0][0],
        handler: route[0][1],
      }]
    }
  
    if (typeof route[0] === 'object') {
      return [{
        ...route[0],
        method,
      }]
    }
  
    return [null, null]
  }


export default ({ registerAction, getHook, registerHook }) => {
    // Register extension points
    registerHook(hooks)

    // Global Express App Context
    const app = express()
    const server = createServer(app)

    // Hooks helper functions
    const registerMiddleware = (a, b) => typeof a === 'string' ? app.use(a, b) : app.use(a)
    const registerHandler = fn => app.use(fn)
    const registerRoute = (method, mountPoint, chain) => app[method.toLowerCase()](mountPoint, chain)
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
            // it will create `req.hooks` object in which we inject the whole
            // `createHookApp` execution context
            app.use(createHookContext({ namespace: 'hooks', inject: ctx }))

            // hook - apply the route trace context to the helper functions
            app.use((req, res, next) => {
                const createHook = req.hooks.createHook
                const tracedCreateHook = (name, options = {}) => createHook(name, { ...options, trace: req.hooks.traceId })
                tracedCreateHook.sync = (name, args) => tracedCreateHook(name, { args })
                tracedCreateHook.serie = (name, args) => tracedCreateHook(name, { args, mode: 'serie' })
                tracedCreateHook.parallel = (name, args) => tracedCreateHook(name, { args, mode: 'parallel' })
                tracedCreateHook.waterfall = (name, args) => tracedCreateHook(name, { args, mode: 'waterfall' })
                
                req.hooks.createHook = tracedCreateHook
                next()
            })
            
            logVerbose('[express] init')
            await createHook.serie(hooks.EXPRESS_HACKS_BEFORE, { app, server })
            
            logVerbose('[express] load middlewares')
            await createHook.serie(hooks.EXPRESS_MIDDLEWARE, { registerMiddleware })

            logVerbose('[express] load routes')
            // await createHook.serie(hooks.EXPRESS_ROUTE, { registerRoute })

            // Register routes with generic and specialized handlers
            const routes = [
                ...createHook.sync(hooks.EXPRESS_ROUTE, { registerRoute }),
                ...createHook.sync(hooks.EXPRESS_GET, { registerRoute: registerRoute.get }).map(makeRoute('get')),
                ...createHook.sync(hooks.EXPRESS_POST, { registerRoute: registerRoute.post }).map(makeRoute('post')),
                ...createHook.sync(hooks.EXPRESS_PUT, { registerRoute: registerRoute.put }).map(makeRoute('put')),
                ...createHook.sync(hooks.EXPRESS_DELETE, { registerRoute: registerRoute.delete }).map(makeRoute('delete')),
            ]

            // Let register a feature with the return value:
            routes.forEach(route => {
                try {
                    if (!route[0].hasOwnProperty('method')) throw new MissingPropertyError()
                    if (!route[0].hasOwnProperty('url')) throw new MissingPropertyError()
                    if (!route[0].hasOwnProperty('handler')) throw new MissingPropertyError()
                    console.log('register', route[0])
                    registerRoute(route[0].method, route[0].url, route[0].handler)
                } catch (e) {
                    // console.error(route[0], e)
                }
            })
            
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

