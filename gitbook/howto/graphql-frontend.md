# GraphQL - Frontend

Now that we have a fully working GraphQL API with some useful endpoints, the only
step left is to adjust our app so to make use of it.

Sit down and relax as this is going to be quick and easy.

## Initial State Autodrive:

Do you remember the [reducers & initial state tutorial](./app-reducers.md) where we
set some values for `ssr`? Here is the code we wrote:

    const initialState = window.__REDUX_INITIAL_STATE__ || {
        app: { name: 'My Custom App Name' },
        ssr: {
            rootUrl: 'http://localhost:8080/',
            apiUrl: 'http://localhost:8080/api/',
        },
    }

This initial state allows you to provide custom values for your root and and api urls.
But now we simply want to talk back to our server... well, just comment out (or remove)
the `ssr` part.

The `@marcopeg/react-ssr` middleware will fill this up automatically.

**NOTE:** you can still have full control over those values, but with SSR you need to move
this configuration into the server, as the initial state is generated there.

## Webpack DevServer Proxy

**-- This step applies only for development purposes --**

When I work on a client/server app I use to run the `npm run start:dev:api` in Terminal1,
and `npm start` in Terminal2. This way Nodemon and Webpack can perform best to live 
reload when I change some code.

The problem is that when my app try to load something from `/api` I need to forward this
request to my API server. Lukily Webpack DevServer offers a 1 line solution to this problem: [the proxy](https://webpack.js.org/configuration/dev-server/#devserver-proxy)

If you are running a `create-react-app` boilerplace just add the proxy setup 
to your `package.json`:

    "proxy": "http://localhost:8080"

## GraphQL Library

Create `src/http.lib.js`:

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

## Simplify the Users Service

Edit `src/features/users/users.service.js` and import the GraphQL library:

    import { runQuery } from '../../http.lib'

now edit the `loadUsers()`:

    export const loadUsers = () => async (dispatch) => {
        try {
            dispatch(loadStart())
            const query = await dispatch(runQuery(`
                query getUsersList {
                    users { id name }
                }
            `))
            dispatch(loadEnd(query.data.users))
        } catch (err) {
            dispatch(loadFailed(err.message))
        }
    }

end edit the `loadUser()`:

    export const loadUser = userId => async (dispatch) => {
        try {
            dispatch(loadStart())
            const query = await dispatch(runQuery(`
                query getUser ($userId: ID!) {
                    user (id: $userId) { id name email }
                    todos (userId: $userId) { id title completed }
                    albums (userId: $userId) { id title }
                }
            `, { userId }))

            dispatch(loadEndUser({
                ...query.data.user,
                ...query.data,
            }))
        } catch (err) {
            dispatch(loadFailed(err.message))
        }
    }

finally we can now get rid of:

- `fetchUser()`
- `fetchUserTodos()`
- `fetchUserAlbums()`

**NOTE:** we were able to remove 3 functions because now all we need to do is to
pack a well structured GraphQL query that is capable of retrieving all the data we
need for a single user!
