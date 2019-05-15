import uuid from 'uuid/v1'
import { EXPRESS_MIDDLEWARE } from './hooks'

export const deviceId = ({ scope, header }) => {
    if (!scope) throw new Error('[deviceId] you must provide a value for "scope"')
    if (!header) throw new Error('[deviceId] you must provide a value for "header"')

    return (req, res, next) => {
        req[scope] = req.get(header) || uuid()
        res.set(header, req[scope])
        next()
    }
}

export const register = ({ registerAction }) =>
    registerAction({
        hook: EXPRESS_MIDDLEWARE,
        name: '→ express/device-id',
        trace: __filename,
        handler: ({ app, settings }) => app.use(deviceId(settings.deviceId)),
    })
