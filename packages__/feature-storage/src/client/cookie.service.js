import Cookie from 'js-cookie'

const cookieName = name => (dispatch, getState) => {
    const { storage } = getState()
    return `${storage.scope}--${name}`
}

export const set = (name, content) => (dispatch, getState) => {
    const { ssr } = getState()

    if (ssr.isClient()) {
        Cookie.set(dispatch(cookieName(name)), content)
    }

    if (ssr.isServer()) {
        ssr.getResponseHandler().cookie(dispatch(cookieName(name)), content)
    }
}

export const get = (name, defaultValue = undefined) => (dispatch, getState) => {
    const { ssr } = getState()

    if (ssr.isClient()) {
        return Cookie.get(dispatch(cookieName(name))) || defaultValue
    }

    if (ssr.isServer()) {
        return ssr.getRequestHandler().cookies[dispatch(cookieName(name))] || defaultValue
    }
}

export const clear = (name) => (dispatch, getState) => {
    const { ssr } = getState()

    if (ssr.isClient()) {
        Cookie.remove(dispatch(cookieName(name)))
    }

    if (ssr.isServer()) {
        ssr.getResponseHandler().clearCookie(dispatch(cookieName(name)))
    }
}
