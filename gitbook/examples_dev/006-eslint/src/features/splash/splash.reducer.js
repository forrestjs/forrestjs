export const initialState = {
    ctime: new Date(),
    minDelay: 750,
    maxDelay: 2000,
    isVisible: true,
}

/**
* Actions
*/

export const SET_HIDDEN = 'setHidden@splash'

export const setHidden = () => ({
    type: SET_HIDDEN,
})

/**
* Handlers
*/

export const actionHandlers = {
    [SET_HIDDEN]: (state) => ({
        ...state,
        isVisible: false,
    }),
}

export default (state = initialState, action) => {
    const handler = actionHandlers[action.type]
    return handler ? handler(state, action) : state
}
