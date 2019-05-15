
export const initialState = {
    isOnline: true,
    isLoading: false,
}

/**
 * Actions
 */

export const SET_STATUS = 'setStatus@network'
export const SET_LOADING = 'setLoading@network'

export const setStatus = value => ({
    type: SET_STATUS,
    payload: {
        value: Boolean(value),
    },
})

export const setLoading = value => ({
    type: SET_LOADING,
    payload: {
        value: Boolean(value),
    },
})


/**
 * Handlers
 */

export const actionHandlers = {
    [SET_STATUS]: (state, { payload }) => ({
        ...state,
        isOnline: payload.value,
    }),
    [SET_LOADING]: (state, { payload }) => ({
        ...state,
        isLoading: payload.value,
    }),
}

export const reducer = (state = initialState, action) => {
    const handler = actionHandlers[action.type]
    return handler ? handler(state, action) : state
}

export default reducer
