import millisecond from 'millisecond'
import cookieParser from 'cookie-parser'
import * as hooks from './hooks'

const DEFAULT_DURATION = '300y'

export const cookieHelper = (settings) => {
    const isDevOrTest = [ 'development', 'test' ].includes(process.env.NODE_ENV)
    const scope = settings.scope || process.env.REACT_APP_ID || 'forrestjs'
    const secure = settings.secure === undefined ? (!isDevOrTest) : settings.secure
    const httpOnly = settings.httpOnly === undefined ? true : settings.httpOnly
    const duration = settings.duration || DEFAULT_DURATION
    const separator = settings.separator === undefined ? '::' : settings.separator
    const clientDuration = settings.clientDuration || duration
    const clientSeparator = settings.clientSeparator === undefined ? '--' : settings.clientSeparator

    const getName = name => `${scope}${separator}${name}`
    const getClientName = name => `${scope}${clientSeparator}${name}`

    const options = {
        app: {
            secure,
            httpOnly,
            maxAge: millisecond(duration),
        },
        client: {
            maxAge: millisecond(clientDuration),
        },
    }

    // Applies validation and transformations to the received options for setting a cookie
    const parseLocalOptions = (receivedOptions = {}) => {
        const options = { ...receivedOptions }
        if (options.maxAge && typeof options.maxAge === 'string') {
            options.maxAge = millisecond(options.maxAge)
        }
        return options
    }

    return (req, res, next) => {
        // Server Cookie
        req.getCookie = name => req.cookies[getName(name)]
        res.setCookie = (name, content, localOptions) => res.cookie(getName(name), content, {
            ...options.app,
            ...parseLocalOptions(localOptions),
        })
        res.deleteCookie = name => res.clearCookie(getName(name))

        // Client Cookie
        req.getClientCookie = name => req.cookies[getClientName(name)]
        res.setClientCookie = (name, content, localOptions) => res.cookie(getClientName(name), content, {
            ...options.client,
            ...parseLocalOptions(localOptions),
        })
        res.deleteClientCookie = name => res.clearCookie(getClientName(name))

        next()
    }
}

export default ({ registerAction, getHook }) =>
    registerAction({
        hook: getHook('EXPRESS_MIDDLEWARE'),
        name: hooks.SERVICE_NAME,
        trace: __filename,
        handler: async ({ registerMiddleware }, { getConfig, registerHook }) => {
            registerHook(hooks)
            registerMiddleware(cookieParser())
            registerMiddleware(cookieHelper(getConfig('expressCookies', {})))
        },
    })
