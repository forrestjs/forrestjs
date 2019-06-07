import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
} from 'graphql'

import { createHook } from '@forrestjs/hooks'
import { EXPRESS_GRAPHQL, EXPRESS_GRAPHQL_TEST } from './hooks'

export const initGraphql = async ({ queries, mutations, settings }) => {
    if (!settings.testIsEnabled) {
        return
    }
    
    if (!settings.testIsValid) {
        return
    }

    const testQueries = {}
    const testMutations = {}

    const queryPrototype = {
        description: 'Enable test apis protected by a token',
        args: {
            token: {
                type: GraphQLString,
            },
        },
        resolve: async (_, args, req) => {
            const isValid = await settings.testIsValid(args.token, req)
            if (!isValid) {
                throw new Error('You can not access the test API')
            }
            return {}
        },
    }

    const defaultQueries = {
        enabled: {
            type: GraphQLBoolean,
            resolve: () => {
                console.log('RUN DEFAULT QU')
                return true
            },
        },
    }

    await createHook(EXPRESS_GRAPHQL_TEST, {
        async: 'serie',
        args: {
            queries: testQueries,
            mutations: testMutations,
        },
    })

    queries.test = {
        ...queryPrototype,
        type: new GraphQLObjectType({
            name: 'TestQuery',
            fields: {
                ...defaultQueries,
                ...testQueries,
            },
        }),
    }

    mutations.test = {
        ...queryPrototype,
        type: new GraphQLObjectType({
            name: 'TestMutation',
            fields: {
                ...defaultQueries,
                ...testMutations,
            },
        }),
    }
}

export const register = ({ registerAction }) =>
    registerAction({
        hook: EXPRESS_GRAPHQL,
        name: EXPRESS_GRAPHQL_TEST,
        trace: __filename,
        handler: initGraphql,
    })
