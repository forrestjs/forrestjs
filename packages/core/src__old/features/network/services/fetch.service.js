import { setLoading } from '../network.reducer'

export const postJSON = (url, data = {}, options = {}) => async (dispatch, getState) => {
    const { ssr } = getState()

    dispatch(setLoading(true))
    try {
        const headers = {
            ...options.headers,
            'content-type': 'application/json',
        }

        const fetchOptions = {
            ...options,
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        }

        const res = await ssr.await(fetch(url, fetchOptions))

        if (res.status !== 200) {
            const error = new Error(`${res.status} - ${res.statusText}`)
            error.response = res
            throw error
        }

        return await res.json()
    } catch (err) {
        throw err
    } finally {
        dispatch(setLoading(false))
    }
}
