import { createServer } from 'http'
import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import { createHook, createHookContext } from '@forrestjs/hooks'
import { SERVICE, INIT_SERVICE, START_SERVICE } from '@forrestjs/hooks'
import { logInfo } from '@forrestjs/service-logger'
import { EXPRESS_INIT, EXPRESS_MIDDLEWARE, EXPRESS_ROUTE, EXPRESS_HANDLER } from './hooks'

const app = express()
const server = createServer(app)
const fallbackPort = '8080'

export const init = async (settings) => {
    logInfo('[express] init...')

    if (!settings) {
        throw new Error('[express] missing settings')
    }

    await createHook(EXPRESS_INIT, {
        async: 'serie',
        args: { app, server, settings: { ...settings } },
    })

    // Basic middlewares
    app.use(compression())
    app.use(helmet())

    // hook - enable a tracing context that is scoped
    // into the current request
    app.use(createHookContext(settings.hooks || {}))

    // classic "data" middleware
    app.use((req, res, next) => {
        req.data = {}
        next()
    })

    await createHook(EXPRESS_MIDDLEWARE, {
        async: 'serie',
        args: { app, server, settings: { ...settings } },
    })
    console.log('express - run hook', EXPRESS_ROUTE)
    await createHook(EXPRESS_ROUTE, {
        async: 'serie',
        args: { app, server, settings: { ...settings } },
    })

    await createHook(EXPRESS_HANDLER, {
        async: 'serie',
        args: { app, server, settings: { ...settings } },
    })
}

export const start = (settings) => new Promise((resolve) => {
    logInfo('[express] start server...')
    const port = settings.port || process.env.REACT_APP_PORT || process.env.PORT || fallbackPort
    server.listen(port, () => {
        logInfo(`[express] server is running on ${port}`)
        resolve()
    })
})

export const register = ({ registerAction }) => {
    registerAction({
        hook: INIT_SERVICE,
        name: `${SERVICE} express`,
        trace: __filename,
        handler: ({ express }) => init(express),
    })

    registerAction({
        hook: START_SERVICE,
        name: `${SERVICE} express`,
        trace: __filename,
        handler: ({ express }) => start(express),
    })
}

