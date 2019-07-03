// @TODO: let a configuration to tell where to fetch the locale files

import path from 'path'
import fs from 'fs'
import createLocaleMiddleware from 'express-locale'
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import GraphQLJSON from 'graphql-type-json'

import * as hooks from './hooks'

const loadLocaleFile = (locale) => new Promise((resolve, reject) => {
    const origin = (process.env.NODE_ENV === 'production')
        ? 'node_build/src'
        : 'src'

    const filePath = path.join(process.cwd(), origin, 'locale', `${locale.toLowerCase()}.json`)
    fs.readFile(filePath, 'utf8', (err, data) => err ? reject(err) : resolve(data))
})

const loadMessages = async (locale) => {
    let data = null

    // try specific language "en_GB"
    try {
        data = await loadLocaleFile(locale)
    } catch (err) {}
    
    // try generic language "en"
    try {
        data = await loadLocaleFile(locale.split('_').shift())
    } catch (err) {
        throw new Error(`localization "${locale}" not available`)
    }

    try {
        return JSON.parse(data)
    } catch (err) {
        throw new Error(`localization "${locale}" is corrupted`)
    }
}

const localeQuery = {
    description: 'Provides localized messages',
    args: {
        locale: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
    type: new GraphQLNonNull(new GraphQLObjectType({
        name: 'Locale',
        fields: {
            locale: {
                type: new GraphQLNonNull(GraphQLString),
            },
            messages: {
                type: GraphQLJSON,
            },
        },
    })),
    resolve: async (params, args) => ({
        locale: args.locale,
        messages: await loadMessages(args.locale),
    }),
}

export default ({ registerHook, registerAction }) => {
    registerHook(hooks)

    registerAction({
        hook: '$EXPRESS_GRAPHQL',
        name: hooks.FEATURE_NAME,
        handler: ({ registerQuery }) => {
            registerQuery('locale', localeQuery)
        },
    })

    registerAction({
        hook: '$EXPRESS_MIDDLEWARE',
        name: hooks.FEATURE_NAME,
        handler: ({ registerMiddleware, getConfig }) => {
            const locale = getConfig('locale', {})
            const config = {
                default: locale.default || 'en_US',
                priority: locale.priority || [
                    'query',
                    'cookie',
                    'accept-language',
                    'default',
                ],
            }

            // Default value is "react-ssr--locale"
            config.cookie = {
                name: (locale && locale.cookieName)
                    ? locale.cookieName
                    : `${process.env.REACT_APP_ID || 'forrestjs'}--locale`
            }

            if (locale.queryName) {
                config.query = { name: locale.queryName }
            }

            if (locale.hostname) {
                config.hostname = locale.hostname
            }

            if (locale.map) {
                config.map = locale.map
            }

            if (locale.allowed) {
                config.allowed = locale.allowed
            }

            registerMiddleware(createLocaleMiddleware(config))
        },
    })
}
