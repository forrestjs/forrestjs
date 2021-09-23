# API - createSSRContext

The SSR context takes shape of a _redux reducer_ named `ssr` that is provided to your
app by `react-ssr`. It facilitates backend oriented tasks like:

- composing urls toward the the server and API
- handling asynchronous calls during SSR
- redirecting

## Initial State Setup

This step is completely optional as `react-ssr` takes care of decent default values
that are used in the piece of code below.

Anyway you can hook into this and, by instance, set a completely external url for all
your API calls.

    const initialState = {
        ...
        ssr: {
            rootUrl: '/',
            apiUrl: '/api',
        }
    }

## How to use it

### In a Container

    const mapState = ({ ssr }) => ({
        env: ssr.isClient() ? 'client' : 'server',
    })

    const MyComponent = ({ env }) =>
        <div>env: {env}</div>

    export default connect(mapState)(MyComponent)

### In a Service (aka: redux-thunk)

    const loadUserById = (userId) => (dispatch, getState) => {
        const { ssr } = getState()
        const restEndpoint = sst.getApiUrl(`/users/${userId}`)
        const res = ssr.await(fetch(restEndpoint))
        return ssr.await(res.json())
    }

## Methods

### ssr.getRootUrl(url)

Composes a url to the root of your web app.

### ssr.getApiUrl(url)

Composes a url to the API endpoint of your web app.

### ssr.redirect(to, code = 300)

Handles a server side redirect with code

### ssr.await(Promise)

Use this to wrap any promise that you want to await during SSR.

> `react-ssr` keeps track of all the promises that you await and runs a new rendering
> cycle after it to find out if there is more stuff to load.

### ssr.setTimeout(() => {}, 1000)

I do not encourage this, but if you find yourself in need of a `setTimeout` that needs
to perform also in the server then this is your method.

### ssr.isClient()

Returns `true` when invoked in a browser.

### ssr.isServer()

Returns `true` when invoked in Node.
