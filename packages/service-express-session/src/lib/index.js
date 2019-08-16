import * as hooks from './hooks'
import { addSession } from './add-session.middleware'
import { sessionQuery } from './graphql/queries/session.query'
import { sessionMutation } from './graphql/mutations/session.mutation'

// Applies default values to `express.session` config object
const buildConfig = ({ getConfig, setConfig }) => {
    const config = {
        ...getConfig('express.session', {}),
        autoStart: getConfig('express.session.autoStart', true),
        autoExtend: getConfig('express.session.autoExtend', true),
        duration: getConfig('express.session.duration', '20m'),
        attributeName: getConfig('express.session.attributeName', 'session'),
        setHeader: getConfig('express.session.setHeader', false),
        headerName: getConfig('express.session.headerName', 'X-Session-Id'),
        setCookie: getConfig('express.session.setCookie', true),
        useClientCookie: getConfig('express.session.useClientCookie', false),
        cookieName: getConfig('express.session.cookieName', 'session-id'),
        uuidVersion: getConfig('express.session.uuidVersion', 'v4'),
        queries: getConfig('express.session.queries', {}),
        mutations: getConfig('express.session.mutations', {}),
        useGraphQL: getConfig('express.session.useGraphQL', true),
        wrapperName: getConfig('express.session.wrapperName', 'session'),
        queryName: getConfig('express.session.queryName', 'SessionQuery'),
        queryDesc: getConfig('express.session.queryDesc', 'Provides info about the running session'),
        mutationName: getConfig('express.session.mutationName', 'SessionMutation'),
        mutationDesc: getConfig('express.session.mutationDesc', 'Change the course of the running session'),
    }

    setConfig('express.session', config)
    return config
}

export default ({ registerAction, registerHook, ...ctx }) => {
    registerHook(hooks)

    registerAction({
        hook: '$EXPRESS_MIDDLEWARE',
        name: hooks.SERVICE_NAME,
        trace: __filename,
        handler: ({ registerMiddleware }, ctx) => {
            const config = buildConfig(ctx)
            registerMiddleware(addSession(config, ctx))
        },
    })

    // Express GraphQL is an optional hook as the service may not be registered
    registerAction({
        hook: '$EXPRESS_GRAPHQL',
        name: hooks.SERVICE_NAME,
        optional: true,
        trace: __filename,
        handler: async ({ registerQuery, registerMutation }, ctx) => {
            const {
                useGraphQL,
                wrapperName,
                ...config } = buildConfig(ctx)

            const queries = { ...config.queries }
            const mutations = { ...config.mutation }

            // Disable the GraphQL wrapper
            if (!useGraphQL) {
                return
            }

            // make the session wrapper extensible
            await ctx.createHook.serie(hooks.EXPRESS_SESSION_GRAPHQL, {
                registerQuery: (key, val) => {
                    if (queries[key]) {
                        throw new Error(`[express-session] Query "${key}" was already defined`)
                    }
                    queries[key] = val
                },
                registerMutation: (key, val) => {
                    if (mutations[key]) {
                        throw new Error(`[express-session] Mutation "${key}" was already defined`)
                    }
                    mutations[key] = val
                },
            })

            // register query and optinal mutation
            registerQuery(wrapperName, await sessionQuery({ ...config, queries }, ctx))
            if (Object.keys(mutations).length) {
                registerMutation(wrapperName, await sessionMutation({ ...config, mutations }, ctx))
            }
        },
    })
}
