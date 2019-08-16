import uuid from 'uuid'
import * as hooks from './hooks'

// Generate a new session payload with an ID.
const createSessionId = async ({
    uuidVersion,
    buffer,
    offset,
    ...config
}, ctx, res) => uuid[uuidVersion](config, buffer, offset)

const initSession = async (config, ctx, req, res) => ({
    id: null,
    jwt: null,
    validUntil: null,
    data: {},
})

const flushSession = async ({
    duration,
    attributeName,
    setHeader,
    headerName,
    setCookie,
    useClientCookie,
    cookieName,
}, ctx, req, res) => {
    const writeCookie = useClientCookie ? res.setClientCookie : res.setCookie
    const token = await ctx.jwt.sign({
        ...req[attributeName].data,
        id: req[attributeName].id,
    }, { expiresIn: duration })
    setHeader && res.set(headerName, token)
    setCookie && writeCookie(cookieName, token, { maxAge: duration })
    return token
}

const getJwtExpiryDate = async (token, ctx) => {
    const data = await ctx.jwt.verify(token)
    return new Date(data.exp * 1000)
}

export const addSession = (config, ctx) => async (req, res, next) => {
    const {
        autoStart,
        autoExtend,
        attributeName,
        headerName,
        setCookie,
        useClientCookie,
        cookieName,
    } = config

    // Get a reference to the cookies helper
    const getCookie = useClientCookie ? req.getClientCookie : req.getCookie
    const deleteCookie = useClientCookie ? res.deleteClientCookie : res.deleteCookie

    if (setCookie && (!getCookie || !deleteCookie)) {
        throw new Error('[express-session] please install "service-express-cookies" before "service-express-session"')
    }

    // initialize the request namespace
    req[attributeName] = await initSession(config, ctx, req, res)

    // generates a new session with an optional custom sessionId and inital client data
    req[attributeName].create = async (sessionId = null, data = {}) => {
        req[attributeName].id = sessionId || await createSessionId(config, ctx, res)
        req[attributeName].data = data
        req[attributeName].jwt = await flushSession(config, ctx, req, res)
        req[attributeName].validUntil = await getJwtExpiryDate(req[attributeName].jwt, ctx)
        await req.hooks.createHook.sync(hooks.EXPRESS_SESSION_START, { req, res })
    }

    // resets the data properties of the running session and removes the cookie (optional)
    req[attributeName].destroy = async () => {
        req[attributeName] = {
            ...req[attributeName],
            ...(await initSession(config, ctx, req, res)),
        }
        setCookie && deleteCookie(cookieName)
    }

    // restore a running session from token, header or cookie and fallback into creating
    // a brand new session
    req[attributeName].start = async (jwt = null) => {
        // avoid multiple initializations per request
        // if a new "jwt" is passed as argument, then the session will be switched accordingly
        if (req[attributeName].id && (req[attributeName].jwt === jwt || !jwt)) {
            return req[attributeName]
        }

        // try to restore an existing session from a token
        try {
            const receivedJWT = jwt || req.headers[headerName] || (setCookie && getCookie(cookieName))
            const receivedData = receivedJWT && (await ctx.jwt.verify(receivedJWT))
            const { id, ...data } = receivedData.payload
            req[attributeName].id = id
            req[attributeName].data = data
            req[attributeName].jwt = autoExtend
                ? await flushSession(config, ctx, req, res)
                : receivedJWT
            req[attributeName].validUntil = await getJwtExpiryDate(req[attributeName].jwt, ctx)

        // generate a new session
        } catch (err) {
            await req[attributeName].create()
        }

        // console.log('>>>> START', req[attributeName].id)
        return req[attributeName]
    }

    // set('foo', 124)
    // set({ foo: 123, name: 'Marco' })
    req[attributeName].set = async (key, val) => {
        if (!req[attributeName].id) {
            throw new Error('[service-express-session] Session not started')
        }

        if (typeof key === 'object') {
            req[attributeName].data = {
                ...req[attributeName].data,
                ...key,
            }
        } else {
            req[attributeName].data[key] = val
        }

        req[attributeName].jwt = await flushSession(config, ctx, req, res)
        req[attributeName].validUntil = await getJwtExpiryDate(req[attributeName].jwt, ctx)
        return true
    }

    req[attributeName].unset = async (keys = []) => {
        if (!req[attributeName].id) {
            throw new Error('[service-express-session] Session not started')
        }

        if (Array.isArray(keys)) {
            keys.forEach(key => {
                delete req[attributeName].data[key]
            })
        } else {
            delete req[attributeName].data[keys]
        }

        req[attributeName].jwt = await flushSession(config, ctx, req, res)
        req[attributeName].validUntil = await getJwtExpiryDate(req[attributeName].jwt, ctx)
        return true
    }

    req[attributeName].get = async (key = null) => {
        if (!req[attributeName].id) {
            throw new Error('[service-express-session] Session not started')
        }

        // return a specific key
        if (key === 'id') {
            return req[attributeName].id
        } else if (key) {
            return req[attributeName].data[key]
        }

        // fallback returns the whole session stored data
        return {
            ...req[attributeName].data,
            id: req[attributeName].id,
        }
    }

    autoStart && await req[attributeName].start()
    next()
}
