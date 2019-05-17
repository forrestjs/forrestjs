export const initialState = {
    isLoading: false,
    hasLoaded: false,
    errorMsg: null,
    list: [],   // used for the menu
    map: {},    // used to show a single user page
}

/**
* Actions
*/

export const LOAD_START = 'loadStart@users'
export const LOAD_END = 'loadEnd@users'
export const LOAD_END_USER = 'loadEndUser@users'
export const LOAD_FAILED = 'loadFailed@users'

export const loadStart = () => ({
    type: LOAD_START,
})

export const loadEnd = users => ({
    type: LOAD_END,
    payload: users,
})

export const loadEndUser = user => ({
    type: LOAD_END_USER,
    payload: user,
})

export const loadFailed = errorMsg => ({
    type: LOAD_FAILED,
    payload: errorMsg,
})

/**
* Handlers
*/

export const actionHandlers = {
    [LOAD_START]: (state) => ({
        ...state,
        isLoading: true,
    }),
    [LOAD_END]: (state, { payload }) => ({
        ...state,
        isLoading: false,
        hasLoaded: true,
        list: payload,
    }),
    [LOAD_END_USER]: (state, { payload }) => ({
        ...state,
        isLoading: false,
        hasLoaded: true,
        map: {
            ...state.map,
            [payload.id]: payload,
        }
    }),
    [LOAD_FAILED]: (state, { payload }) => ({
        ...state,
        isLoading: false,
        hasLoaded: true,
        errorMsg: payload,
    }),
}

export default (state = initialState, action) => {
    const handler = actionHandlers[action.type]
    return handler ? handler(state, action) : state
}
