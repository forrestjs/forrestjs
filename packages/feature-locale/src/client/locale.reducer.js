
export const initialState = {
    locale: 'en',
    locales: {},
    cacheLocal: false,
    cacheDuration: 86400000, // 24h
}

/**
 * Actions
 */

export const SET_LOCALE = 'setLocale@locale'
export const ADD_LOCALE = 'addLocale@locale'

export const setLocale = locale => ({
    type: SET_LOCALE,
    payload: { locale },
})

export const addLocale = (key, value, ctime) => ({
    type: ADD_LOCALE,
    payload: { key, value, ctime },
})


/**
 * Handlers
 */

export const actionHandlers = {
    [SET_LOCALE]: (state, { payload }) => ({
        ...state,
        locale: payload.locale,
    }),
    [ADD_LOCALE]: (state, { payload }) => ({
        ...state,
        locales: {
            ...state.locales,
            [payload.key]: {
                messages: payload.value,
                ctime: payload.ctime,
            },
        },
    }),
}

export const reducer = (state = initialState, action) => {
    const handler = actionHandlers[action.type]
    return handler ? handler(state, action) : state
}

export default reducer

