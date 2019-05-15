/* eslint import/prefer-default-export: off */

export const createSSRContext = (settings) => {
    const awaitStack = []
    const callbacks = {}

    const rootUrl = settings.rootUrl
        ? settings.rootUrl
        : '/'
    
    const apiUrl = settings.apiUrl
        ? settings.apiUrl
        : '/api'

    let checkTimer = null

    // store local context to keep track of possible actions
    const ctx = {}

    const upsert = (action) => {
        if (!callbacks[action]) {
            callbacks[action] = []
        }
    }

    const emit = (action) => {
        upsert(action)
        callbacks[action].forEach((ticket) => {
            if (ticket.once) {
                ticket.off()
            }
            ticket.fn()
        })
    }

    const checkStack = () => {
        if (awaitStack.length <= 0) {
            emit('complete')
        }
        return awaitStack.length
    }

    const unsubscribe = (action, ticket) => {
        const idx = callbacks[action].indexOf(ticket)
        callbacks[action].splice(idx, 1)
    }

    const subscribe = (action, fn, once = false) => {
        upsert(action)
        const ticket = { fn, once }
        ticket.off = () => unsubscribe(action, ticket)

        callbacks[action].push(ticket)
        setTimeout(checkStack)
        return ticket
    }

    const reducer = {
        ...settings,
        checkStack,
        
        // event emitter
        on: (action, fn) => subscribe(action, fn, false),
        once: (action, fn) => subscribe(action, fn, true),

        // ssr compatible promise wrapper
        await: p => {
            awaitStack.push(p)

            p.then((v) => {
                clearTimeout(checkTimer)
                const idx = awaitStack.indexOf(p)
                awaitStack.splice(idx, 1)
                checkTimer = setTimeout(checkStack)
            }, (e) => {
                clearTimeout(checkTimer)
                const idx = awaitStack.indexOf(p)
                awaitStack.splice(idx, 1)
                checkTimer = setTimeout(checkStack)
            })

            return p
        },

        // perform a ssr compatible timeout
        setTimeout: (fn, delay) => new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    fn()
                    resolve()
                } catch (err) {
                    reject(err)
                }
            }, delay)
        }),

        // allow for app related decision making
        isServer: () => typeof window === 'undefined' && typeof process === 'object',
        isClient: () => typeof window === 'object',
        
        // deprecated
        // apiUrl: url => {
        //     console.warn('[create-ssr-context] apiUrl is deprecated, please use "getApiUrl()" instead')
        //     return `${apiUrl}${url}`.replace(/([^:]\/)\/+/g, '$1')
        // },

        getRootUrl: url => rootUrl === '/' ? rootUrl : `${rootUrl}${url}`.replace(/([^:]\/)\/+/g, '$1'),
        getApiUrl: url => apiUrl === '/' ? apiUrl : `${apiUrl}${url}`.replace(/([^:]\/)\/+/g, '$1'),
        getHistory: () => settings.history,
        getRequestHandler: () => settings.req,
        getResponseHandler: () => settings.res,

        // redirect helper
        redirect: (to, code = 300) => {
            ctx.redirect = to
            ctx.redirectCode = code
        },
        hasRedirect: () => ctx.redirect,
        getRedirect: () => {
            return ctx.redirect
                ? { url: ctx.redirect, code: ctx.redirectCode }
                : null
        },
    }


    return {
        reducers: {
            ssr: () => reducer,
            // ssr: state => state || reducer,
        },
    }
}