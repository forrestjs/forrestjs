import {
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
} from 'graphql'

import { createHook } from '@marcopeg/hooks'
import { INIT_SERVICE } from '@marcopeg/hooks'
import { EXPRESS_GRAPHQL, EXPRESS_GRAPHQL_TEST } from './hooks'

const settings = {}

export const init = ({ isEnabled, token }) => {
    settings.isEnabled = isEnabled
    settings.token = token
}

export const validateToken = (token) => {
    if (!settings.isEnabled) {
        throw new Error('n/a')
    }

    if (settings.token !== token) {
        throw new Error('invalid token')
    }

    return true
}

export const initGraphql = async ({ queries, mutations }) => {
    if (!settings.isEnabled) {
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
        resolve: (params, args) => validateToken(args.token),
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

export const register = ({ registerAction }) => {
    registerAction({
        hook: INIT_SERVICE,
        name: EXPRESS_GRAPHQL_TEST,
        trace: __filename,
        handler: ({ graphqlTest }) => init(graphqlTest),
    })

    registerAction({
        hook: EXPRESS_GRAPHQL,
        name: EXPRESS_GRAPHQL_TEST,
        trace: __filename,
        handler: initGraphql,
    })
}
