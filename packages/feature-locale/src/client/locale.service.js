import { runQuery } from '@forrestjs/feature-network/client'
import { cookie, localStorage } from '@forrestjs/feature-storage/client'
import localeQuery from './locale.query'
import { addLocale, setLocale } from './locale.reducer'

const isCacheValid = ctime => (_, getState) => {
    const { locale } = getState()
    const { cacheDuration } = locale

    return (new Date() - new Date(ctime)) < cacheDuration
}

const localeExists = (desiredLocale) => (dispatch, getState) => {
    const { locale } = getState()
    const current = locale.locales[desiredLocale]

    if (!current) {
        return false
    }

    return dispatch(isCacheValid(current.ctime))
}

const getCurrentLocale = () => (dispatch, getState) => {
    const { locale, ssr } = getState()

    // get locale from the current request using `express-locale`
    // during SSR, use the cookie in the client
    if (ssr.isServer()) {
        const req = ssr.getRequestHandler()
        return `${req.locale.language}_${req.locale.region}`
    } else {
        return dispatch(cookie.get('locale', locale.locale))
    }
}

const setCurrentLocale = (locale) => (dispatch) => {
    dispatch(setLocale(locale))
    dispatch(cookie.set('locale', locale))
}

const addLocaleData = (record) => (dispatch, getState) => {
    const { locale } = getState()
    const ctime = record.ctime || new Date()

    dispatch(addLocale(record.locale, record.messages, ctime))

    if (locale.cacheLocal === true) {
        dispatch(localStorage.setItem(`locale::cache::${record.locale}`, {
            ...record,
            ctime,
        }))
    }
}

export const fetchLocale = (locale) => async (dispatch) => {
    const res = await dispatch(runQuery(localeQuery, { locale }))
    return res.data.locale
}

export const loadLocale = (desiredLocale) => async (dispatch, getState) => {
    // try switch in-memory
    if (dispatch(localeExists(desiredLocale))) {
        dispatch(setCurrentLocale(desiredLocale))
        return
    }

    let cachedData = null
    let remoteData = null

    // try load from local storaged cache
    try {
        cachedData = dispatch(localStorage.getItem(`locale::cache::${desiredLocale}`))
        if (cachedData && dispatch(isCacheValid(cachedData.ctime))) {
            remoteData = cachedData
        }
    } catch (err) {} // eslint-disable-line

    // fetch from the server
    if (!remoteData) {
        try {
            remoteData = await dispatch(fetchLocale(desiredLocale))
        } catch (err) {} // eslint-disable-line
    }

    // verify remote data or fallback on pre-existing cache
    if (!remoteData) {
        console.log(`[locale] failed to load locale: ${desiredLocale}`)

        if (cachedData) {
            console.log('[locale] defaulting to an old cached definition')
            remoteData = cachedData
        } else {
            return
        }
    }

    dispatch(addLocaleData(remoteData))
    dispatch(setCurrentLocale(desiredLocale))
}

export const init = () => (dispatch) => {
    try {
        window.loadLocale = locale => dispatch(loadLocale(locale))
    } catch (err) {} // eslint-disable-line
}

export const start = () => (dispatch, getState) => {
    const { ssr } = getState()
    const current = dispatch(getCurrentLocale())
    return ssr.await(dispatch(loadLocale(current)))
}
