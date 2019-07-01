import expressGraphql from 'express-graphql'
import { makeSchema } from './schema'
import * as hooks from './hooks'

const cache = {
    activeEtag: 0,
    cachedEtag: null,
    schema: null,
}

export const bumpGraphqlETAG = (value = null) => {
    if (value === null) {
        cache.activeEtag += 1
    } else {
        cache.activeEtag = value
    }
}

export const createGraphQLMiddleware = async ({ settings, isDevOrTest }, ctx) => {
    const {
        queries = {},
        mutations = {},
    } = settings

    const config = {
        graphiql: isDevOrTest,
        ...(settings.config ? settings.config : {}),
    }

    // Build up the first cached schema so that any weird errors might
    // be checked out at boot time.
    cache.cachedEtag = cache.activeEtag
    cache.schema = await makeSchema({ queries, mutations, config, settings }, ctx)

    return async (req, res, next) => {
        // Refresh the schema cache
        if (cache.schema === null || cache.cachedEtag !== cache.activeEtag) {
            cache.cachedEtag = cache.activeEtag
            cache.schema = await makeSchema({ queries, mutations, config, settings })
        }

        return expressGraphql({
            ...config,
            schema: cache.schema,
            context: {
                ...(config.context ? config.context : {}),
                req,
                res,
            }
        })(req, res, next)
    }
}

export default ({ registerAction, registerHook, createHook, ...otherProps }) => {
    const isDevOrTest = [ 'development', 'test' ].includes(process.env.NODE_ENV)

    // register services's hooks
    registerHook(hooks)

    const invalidateCacheMiddleware = (req, res, next) => {
        req.bumpGraphqlETAG = bumpGraphqlETAG
        next()
    }

    // register the basic GraphQL api
    registerAction({
        hook: '$EXPRESS_MIDDLEWARE',
        name: hooks.SERVICE_NAME,
        trace: __filename,
        handler: async ({ registerMiddleware }, { getConfig }) => {
            // get default configs
            const {
                mountPoint = '/api',
                middlewares = [],
                bodyParser = {},
                ...settings
            } = getConfig('expressGraphql', {})

            // let extensions inject custom middlewares
            await createHook.serie(hooks.EXPRESS_GRAPHQL_MIDDLEWARE, {
                registerMiddleware: $ => middlewares.push($),
            })

            // register the optional bodyParser with custom configuration
            if (bodyParser) {
                if (typeof bodyParser === 'object') {
                    registerMiddleware(require('body-parser').json(bodyParser))
                } else {
                    registerMiddleware(require('body-parser').json())
                }
            }

            // register the endpoint route
            // need to pass down the feature context to leverage on extensibility
            registerMiddleware(mountPoint, [
                invalidateCacheMiddleware,
                ...middlewares,
                await createGraphQLMiddleware({
                    settings, 
                    isDevOrTest,
                }, { registerAction, registerHook, createHook, ...otherProps })
            ])
        },
    })
}
