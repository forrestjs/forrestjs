// import Sequelize from 'sequelize'
import { POSTGRES_BEFORE_START } from '@forrestjs/service-postgres/lib/hooks'
import * as hooks from './hooks'
import * as authAccountModel from './auth-account.model'
import { testCreateAccountMutation } from './graphql/mutations/test/create-account.mutation'
import { loginMutation } from './graphql/mutations/login.mutation'
import { logoutMutation } from './graphql/mutations/logout.mutation'
import { authQuery } from './graphql/queries/auth.query'
import { authMutation } from './graphql/mutations/auth.mutation'
import { addAuth } from './auth.middleware'

// Applies default values to `express.session` config object
const buildConfig = ({ getConfig, setConfig }) => {
    const config = {
        ...getConfig('auth', {}),
        queries: getConfig('auth.queries', {}),
        mutations: getConfig('auth.mutations', {}),
    }

    setConfig('auth', config)
    return config
}

export default ({ registerHook, registerAction }) => {
    registerHook(hooks)

    // Add Auth Data Model
    registerAction({
        hook: `${POSTGRES_BEFORE_START}/default`,
        name: hooks.FEATURE_NAME,
        handler: ({ registerModel }) => {
            registerModel(authAccountModel)
        },
    })

    // Enrich the Session's Model with Auth related fields
    // registerAction({
    //     hook: '$SESSION_INIT_MODEL',
    //     name: hooks.FEATURE_NAME,
    //     trace: __filename,
    //     handler: ({ fields }) => {
    //         fields.authId = {
    //             type: Sequelize.UUID,
    //         }
    //         fields.authEtag = {
    //             type: Sequelize.INTEGER,
    //         }
    //     },
    // })

    // Enrich the Session's Model with Auth related helper functions
    // registerAction({
    //     hook: '$SESSION_DECORATE_MODEL',
    //     name: hooks.FEATURE_NAME,
    //     trace: __filename,
    //     handler: ({ Model }) => {
    //         Model.setAuth = (id, authId, authEtag) => Model.update({
    //             authId, authEtag,
    //         }, { where: { id } })
    //     },
    // })

    registerAction({
        hook: '$EXPRESS_MIDDLEWARE',
        name: hooks.FEATURE_NAME,
        trace: __filename,
        handler: ({ registerMiddleware }, ctx) => {
            const config = buildConfig(ctx)
            registerMiddleware(addAuth(config, ctx))
        },
    })

    // Extends GraphQL Schema
    registerAction({
        hook: '$EXPRESS_GRAPHQL',
        name: hooks.FEATURE_NAME,
        trace: __filename,
        handler: async ({ registerMutation }, ctx) => {
            registerMutation('login', await loginMutation())
            registerMutation('logout', await logoutMutation())
        },
    })

    // Extends Session Schema with the Auth Wrapper
    registerAction({
        hook: '$EXPRESS_SESSION_GRAPHQL',
        name: hooks.FEATURE_NAME,
        trace: __filename,
        handler: async ({ registerQuery, registerMutation }, ctx) => {
            const config = buildConfig(ctx)
            const queries = { ...config.queries }
            const mutations = { ...config.mutation }

            // make the Auth wrapper extensible
            await ctx.createHook.serie(hooks.PG_AUTH_GRAPHQL, {
                registerQuery: (key, val) => {
                    if (queries[key]) {
                        throw new Error(`[pg-auth] Query "${key}" was already defined`)
                    }
                    queries[key] = val
                },
                registerMutation: (key, val) => {
                    if (mutations[key]) {
                        throw new Error(`[pg-auth] Mutation "${key}" was already defined`)
                    }
                    mutations[key] = val
                },
            })

            // register query and optinal mutation
            // registerQuery(wrapperName, await sessionQuery({ ...config, queries }, ctx))
            if (Object.keys(queries).length) {
                registerQuery('auth', await authQuery(queries, config, ctx))
            }
            if (Object.keys(mutations).length) {
                registerMutation('auth', await authMutation(mutations, config, ctx))
            }
        },
    })

    // Extends Testing GraphQL Schema
    registerAction({
        hook: '$EXPRESS_GRAPHQL_TEST',
        name: hooks.FEATURE_NAME,
        handler: async ({ registerMutation }, ctx) => {
            registerMutation('createAccount', await testCreateAccountMutation())
        },
    })
}
