// https://www.npmjs.com/package/express-locale

import createLocaleMiddleware from 'express-locale'
import { SERVICE } from '@marcopeg/hooks'
import { EXPRESS_MIDDLEWARE } from './hooks'

export const register = ({ registerAction }) =>
    registerAction({
        hook: EXPRESS_MIDDLEWARE,
        name: `${SERVICE} express/locale`,
        handler: ({ app, settings }) => {
            const locale = settings.locale || {}
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
                    : `${process.env.REACT_APP_ID || 'react-ssr'}--locale`
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

            app.use(createLocaleMiddleware(config))
        },
    })
