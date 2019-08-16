import * as hooks from './hooks'
import { addDeviceId } from './add-device-id.middleware'
import { deviceQuery } from './graphql/queries/device.query'

const buildConfig = ({ getConfig }) => ({
    ...getConfig('express.device', {}),
    setHeader: getConfig('express.device.setHeader', true),
    headerName: getConfig('express.device.headerName', 'X-Device-Id'),
    uuidVersion: getConfig('express.device.uuidVersion', 'v4'),
    attributeName: getConfig('express.device.attributeName', 'deviceId'),
    setCookie: getConfig('express.device.setCookie', true),
    useClientCookie: getConfig('express.device.useClientCookie', false),
    cookieName: getConfig('express.device.cookieName', 'device-id'),
    cookieMaxAge: getConfig('express.device.cookieMaxAge', '300y'),
})

export default ({ registerAction, registerHook, ...ctx }) => {
    registerHook(hooks)

    registerAction({
        hook: '$EXPRESS_MIDDLEWARE',
        name: hooks.SERVICE_NAME,
        trace: __filename,
        handler: ({ registerMiddleware }, ctx) => {
            const config = buildConfig(ctx)
            registerMiddleware(addDeviceId(config))
        },
    })

    // Express GraphQL is an optional hook as the service may not be registered
    registerAction({
        hook: '$EXPRESS_GRAPHQL',
        name: hooks.SERVICE_NAME,
        optional: true,
        trace: __filename,
        handler: ({ registerQuery }, ctx) => {
            const config = buildConfig(ctx)
            registerQuery('device', deviceQuery(config))
        },
    })
}
