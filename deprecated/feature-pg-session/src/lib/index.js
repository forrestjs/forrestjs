import { GraphQLBoolean } from 'graphql'
import { POSTGRES_BEFORE_START } from '@forrestjs/service-postgres/lib/hooks'
import { getModel } from '@forrestjs/service-postgres'
import * as hooks from './hooks'
import * as sessionModel from './session.model'
import { addSession } from './session.middleware'

export default ({ registerHook, registerAction }) => {
    registerHook(hooks)

    registerAction({
        hook: `${POSTGRES_BEFORE_START}/default`,
        name: hooks.FEATURE_NAME,
        handler: ({ registerModel }) => {
            registerModel(sessionModel)
        },
    })

    registerAction({
        hook: '$EXPRESS_MIDDLEWARE',
        name: hooks.FEATURE_NAME,
        trace: __filename,
        handler: ({ registerMiddleware }, ctx) => {
            const config = {
                ...(ctx.getConfig('express.session')),
                autoValidate: ctx.getConfig('express.session.autoValidate', false),
            }
            registerMiddleware(addSession(config, ctx))
        },
    })

    registerAction({
        hook: '$EXPRESS_SESSION_START',
        name: hooks.FEATURE_NAME,
        handler: () => getModel('SessionRecord').cleanup(),
    })

    registerAction({
        hook: '$EXPRESS_SESSION_GRAPHQL_ARGS',
        name: hooks.FEATURE_NAME,
        trace: __filename,
        handler: async ({ registerArg }, ctx) =>
            registerArg('validate', {
                type: GraphQLBoolean,
                defaultValue: true,
            }),
    })

    registerAction({
        hook: '$EXPRESS_SESSION_GRAPHQL_VALIDATE',
        name: hooks.FEATURE_NAME,
        trace: __filename,
        handler: async ({ session, args }, ctx) =>
            args.validate
                ? session.validate()
                : null,
    })
}
