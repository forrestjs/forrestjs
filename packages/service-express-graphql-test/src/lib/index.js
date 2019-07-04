import { GraphQLObjectType, GraphQLString } from 'graphql'
import * as hooks from './hooks'


export default ({ registerAction, registerHook }) => {
    // register services's hooks
    registerHook(hooks)
    
    registerAction({
        hook: '$EXPRESS_GRAPHQL',
        name: hooks.SERVICE_NAME,
        trace: __filename,
        handler: async ({ registerQuery, registerMutation }, ctx) => {
            const {
                wrapperName = 'test',
                wrapperDescription = 'Enable test apis protected by a token',
                queryName = 'TestQuery',
                mutationName = 'TestMutation',
                isValidError = 'Access denied to test API',
                queries = {},
                mutations = {},
                ...settings
            } = ctx.getConfig('expressGraphqlTest', {})

            // Extend the existing schema with custom queries and mutations
            await ctx.createHook.serie(hooks.EXPRESS_GRAPHQL_TEST, {
                registerQuery: (key, val) => {
                    if (queries[key]) {
                        throw new Error(`[express-graphql-test] Query "${key}" was already defined`)
                    }
                    queries[key] = val
                },
                registerMutation: (key, val) => {
                    if (queries[key]) {
                        throw new Error(`[express-graphql-test] Mutation "${key}" was already defined`)
                    }
                    mutations[key] = val
                },
                replaceIsEnabled: fn => settings.isEnabled = fn,
                replaceIsValid: fn => settings.isValid = fn,
            })

            // Check if the test wrapper is enabled according to the provided logic
            const isEnabled = settings.isEnabled || (() => [ 'development', 'test' ].includes(process.env.NODE_ENV))
            if (await isEnabled(ctx) !== true) {
                return
            }

            // Wrapper prototype
            const queryPrototype = {
                description: wrapperDescription,
                args: {
                    token: {
                        type: GraphQLString,
                    },
                },
                resolve: async (_, args, resolverCtx) => {
                    const isValid = settings.isValid || (() => true)
                    if (await isValid(args, resolverCtx, ctx) !== true) {
                        throw new Error(isValidError)
                    }
                    return true
                },
            }

            // Register queries, if any
            if (Object.keys(queries).length) {
                registerQuery(wrapperName, {
                    ...queryPrototype,
                    type: new GraphQLObjectType({
                        name: queryName,
                        fields: queries,
                    }),
                })
            }

            // Register mutations, if any
            if (Object.keys(mutations).length) {
                registerMutation(wrapperName, {
                    ...queryPrototype,
                    type: new GraphQLObjectType({
                        name: mutationName,
                        fields: mutations,
                    }),
                })
            }
        },
    })
}
