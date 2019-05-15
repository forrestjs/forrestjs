import { createServer } from 'http'
import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import { createHook, createHookContext } from '@marcopeg/hooks'
import { INIT_SERVICE, START_SERVICE } from '@marcopeg/hooks'
import { logInfo } from '../logger'
import { EXPRESS_INIT, EXPRESS_MIDDLEWARE, EXPRESS_ROUTE, EXPRESS_HANDLER } from './hooks'

const app = express()
const server = createServer(app)

export const init = async (settings) => {
    logInfo('[express] init...')

    if (!settings) {
        throw new Error('[express] missing settings')
    }

    await createHook(EXPRESS_INIT, {
        async: 'serie',
        args: { app, server, settings: { ...settings } },
    })

    // hook - enable a tracing context that is scoped
    // into the current request
    app.use(createHookContext(settings.hooks || {}))

    // Basics
    app.use(compression())
    app.use(helmet())

    app.use((req, res, next) => {
        req.data = {}
        next()
    })

    await createHook(EXPRESS_MIDDLEWARE, {
        async: 'serie',
        args: { app, server, settings: { ...settings } },
    })

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
    const port = settings.port || process.env.REACT_APP_PORT || process.env.PORT || '8080'
    server.listen(port, () => {
        logInfo(`[express] server is running on ${port}`)
        resolve()
    })
})

export const register = ({ registerAction }) => {
    registerAction({
        hook: INIT_SERVICE,
        name: '→ express',
        trace: __filename,
        handler: ({ express }) => init(express),
    })

    registerAction({
        hook: START_SERVICE,
        name: '→ express',
        trace: __filename,
        handler: ({ express }) => start(express),
    })
}

