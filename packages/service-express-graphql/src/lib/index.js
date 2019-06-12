import { GraphQLString } from 'graphql'
import expressGraphql from 'express-graphql'
import { EXPRESS_ROUTE } from '@forrestjs/service-express'
import { EXPRESS_GRAPHQL, EXPRESS_GRAPHQL_MIDDLEWARE } from './hooks'
import { makeSchema } from './schema'

const info = {
    description: 'Provides info regarding the project',
    type: GraphQLString,
    resolve: () => `GraphQL is working`,
}

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

export const createGraphQLMiddleware = async (settings) => {
    const isDev = ['development', 'test'].indexOf(process.env.NODE_ENV) !== -1

    const queries = {
        info,
        ...(settings.queries ? settings.queries : {}),
    }
    const mutations = {
        info,
        ...(settings.mutations ? settings.mutations : {}),
    }
    const config = {
        graphiql: isDev,
        ...(settings.config ? settings.config : {}),
    }

    return async (req, res, next) => {
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

export const register = ({ registerAction, createHook, ...props }) => {
    const invalidateCacheMiddleware = (req, res, next) => {
        req.bumpGraphqlETAG = bumpGraphqlETAG
        next()
    }

    // register the basic GraphQL api
    registerAction({
        hook: EXPRESS_ROUTE,
        name: EXPRESS_GRAPHQL,
        trace: __filename,
        handler: async ({ app, settings }) => {
            const { mountPoint, middlewares = [] } = settings.graphql || {}

            await createHook(EXPRESS_GRAPHQL_MIDDLEWARE, {
                async: 'serie',
                args: { middlewares },
            })

            app.use(mountPoint || '/api', [
                invalidateCacheMiddleware,
                ...middlewares,
                await createGraphQLMiddleware(settings.graphql || {})
            ])
        },
    })

    // register the testing extension
    if (process.env.NODE_ENV !== 'production') {
        require('./test').register({
            registerAction,
            ...props,
        })
    }
}
