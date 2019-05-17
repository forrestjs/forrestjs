// Uses the Fetch api to hit a REST endpoint
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

export const postJSON = async (url, data = {}, config = {}) => {
    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
    }

    const res = await fetch(url, options)
    return await res.json()
}

export const runQuery = (query = null, variables = {}) =>
    async (dispatch, getState) => {
        const { ssr } = getState()
        const endpoint = ssr.getApiUrl('')
        return await ssr.await(postJSON(endpoint, {
            query,
            variables,
        }))
    }
