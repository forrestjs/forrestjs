import { postJSON } from './fetch.service'

/**
 * Options:
 * - debug:        (bool: false)
 * - ignoreErrors: (bool: false) avoid to throw in case of graphql errors
 * - endpoint:     (string: null) provide a custom http endpoint
 *
 * Returns:
 * { data: {}, errors: [] }
 */
export const runQuery = (query = null, variables = {}, options = {}) =>
    async (dispatch, getState) => {
        if (!query) {
            throw new Error('[graphql] please provide a query')
        }

        const { ssr } = getState()
        const { debug, ignoreErrors, ...otherOptions } = options
        const endpoint = options.endpoint || ssr.getApiUrl('')
        let result = null

        const fetchOptions = {
            credentials: 'include',
            ...otherOptions,
        }

        // SSR: forward cookies and auth headers
        if (process.env.REACT_SSR) {
            const req = ssr.getRequestHandler()
            fetchOptions.headers = {
                ...(otherOptions.headers || {}),
                Cookie: req.headers.cookie,
            }
        }

        if (debug) {
            console.log('>>>>>>>>>>>> GRAPHQL')
            console.log(endpoint)
            console.log(query)
            console.log(variables)
            console.log(fetchOptions)
            console.log(JSON.stringify(variables))
            console.log('<<<<<<<<<<< GRAPHQL')
        }

        try {
            result = await dispatch(postJSON(endpoint, {
                query,
                variables,
            }, fetchOptions))
        } catch (err) {
            // must be a real network error
            if (!err.response) {
                const error = new Error(`[graphql] ${err.message}`)
                error.query = query
                error.originalError = err
                throw error
            }

            // might be a graphql handled error
            try {
                result = JSON.parse(await err.response.text())
            } catch (jsonErr) {
                throw err
            }
        }

        if (result.errors && ignoreErrors !== true) {
            const error = new Error(result.errors[0].message)
            error.graphQLErrors = result.errors
            error.graphQLResponse = result

            // detect an authorization problem and dispatch an action
            // (that should kick out the user)
            if (result.errors.find(err => err.message.indexOf('403') !== -1)) {
                dispatch({ type: '@graphql::403', payload: {
                    code: 403,
                    message: 'access denied',
                    type: 'graphql',
                    data: result,
                } })
            }

            throw error
        }

        return result
    }
