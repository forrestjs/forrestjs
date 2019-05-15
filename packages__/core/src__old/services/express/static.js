import express from 'express'
import { EXPRESS_MIDDLEWARE, EXPRESS_STATIC } from './hooks'

export const register = ({ registerAction }) =>
    registerAction({
        hook: EXPRESS_MIDDLEWARE,
        name: EXPRESS_STATIC,
        trace: __filename,
        handler: ({ app, settings }) => {
            for (const rule of (settings.static || [])) {
                app.use(rule.path, express.static(rule.source))
            }
        },
    })

