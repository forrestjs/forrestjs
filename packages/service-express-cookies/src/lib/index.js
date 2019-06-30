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

    return (req, res, next) => {
        // Server Cookie
        req.getCookie = name => req.cookies[getName(name)]
        res.setCookie = (name, content) => res.cookie(getName(name), content, options.app)
        res.deleteCookie = name => res.clearCookie(getName(name))

        // Client Cookie
        req.getClientCookie = name => req.cookies[getClientName(name)]
        res.setClientCookie = (name, content) => res.cookie(getClientName(name), content, options.client)
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
