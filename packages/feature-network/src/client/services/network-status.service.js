// Inspired by:
// https://github.com/chrisbolin/react-detect-offline/blob/master/src/index.js
//
// NOTE: this could be heavily improved by falling back on some kind of polling
// in case the browser doesn't support the online/offline method
//

import { setStatus } from '../network.reducer'

const isClient = typeof navigator !== 'undefined'

const goOnline = () => (dispatch) => {
    dispatch(setStatus(true))
}
const goOffline = () => (dispatch) => {
    dispatch(setStatus(false))
}

export const start = () => (dispatch) => {
    if (isClient) {
        window.addEventListener('online', () => dispatch(goOnline()))
        window.addEventListener('offline', () => dispatch(goOffline()))
    }
}
