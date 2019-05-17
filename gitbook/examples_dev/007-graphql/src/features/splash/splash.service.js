import { setHidden } from './splash.reducer'

// last the SplashScreen for a minimum amoun of time
// (defined in the reducer) so to avoid a fast flickering
// effect that would produce discomfort to the user.
export const hide = () => (dispatch, getState) => {
    const { ssr, splash } = getState()

    if (ssr.isServer()) {
        dispatch(setHidden())
        return
    }

    const loadTime = new Date() - splash.ctime
    const delay = loadTime > splash.minDelay ? 0 : splash.minDelay - loadTime
    setTimeout(() => dispatch(setHidden()), delay)
}

// safety check, in case the listener don't fire we can simply
// hide the loading after a while.
export const start = () => (dispatch, getState) => {
    const { ssr, splash } = getState()

    if (ssr.isServer()) {
        dispatch(setHidden())
        return
    }

    setTimeout(() => {
        dispatch(setHidden())
    }, splash.maxDelay)
}
