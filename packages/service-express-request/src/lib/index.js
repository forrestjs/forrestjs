import * as hooks from './hooks'
import addRequestId from 'express-request-id'
import { requestQuery } from './graphql/queries/request.query'

const buildConfig = ({ getConfig }) => getConfig('express.request', {})

export default ({ registerAction, registerHook, ...ctx }) => {
    registerHook(hooks)

    registerAction({
        hook: '$EXPRESS_MIDDLEWARE',
        name: hooks.SERVICE_NAME,
        trace: __filename,
        handler: ({ registerMiddleware }, ctx) => {
            const config = buildConfig(ctx)
            registerMiddleware(addRequestId(config))
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
            registerQuery('request', requestQuery(config, ctx))
        },
    })
}
