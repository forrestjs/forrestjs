import {
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
} from 'graphql'

import { createHook } from '@marcopeg/hooks'
import { EXPRESS_GRAPHQL, EXPRESS_GRAPHQL_TEST } from './hooks'

export const validateToken = (token, testToken) => {
    if (!testToken) {
        throw new Error('n/a')
    }

    if (token !== testToken) {
        throw new Error('invalid token')
    }

    return true
}

export const initGraphql = async ({ queries, mutations, settings }) => {
    if (!settings.testIsEnabled) {
        return
    }

    const testQueries = {}
    const testMutations = {}

    const queryPrototype = {
        description: 'Enable test apis protected by a token',
        args: {
            token: {
                type: new GraphQLNonNull(GraphQLString),
            },
        },
        resolve: (params, args) => validateToken(args.token, settings.testToken),
    }

    const defaultQueries = {
        enabled: {
            type: GraphQLBoolean,
            resolve: () => true,
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
                ...testQueries,
                ...defaultQueries,
            },
        }),
    }

    mutations.test = {
        ...queryPrototype,
        type: new GraphQLObjectType({
            name: 'TestMutation',
            fields: {
                ...testMutations,
                ...defaultQueries,
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
