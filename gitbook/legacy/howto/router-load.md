# React Router - Load stuff

Now it is time to make the user's detail page useful.

Thanks to the [jsonplaceholder](https://jsonplaceholder.typicode.com) project we can
load a bunch of stuff that is related to a given user.

After a brief meeeeeeting we decided to show some **todos** and a list of links
to the user's **photo albums**.

### Hack the reducer

In order to show a single user we need a way to store his data in _redux_.
Here you find a simple but effective way to store many user's data as soon as they
load, so to provide a sorta of client side caching layer while moving around the app.

It's very basic but quite effective if your pages don't update so often.

Open `/src/features/users/users.reducer.js` and integrate with the followingo code:

    export const initialState = {
        isLoading: false,
        hasLoaded: false,
        errorMsg: null,
        list: [],   // used for the menu
        map: {},    // used to show a single user page
    }

    ...

    export const LOAD_END_USER = 'loadEndUser@users'

    export const loadEndUser = user => ({
        type: LOAD_END_USER,
        payload: user,
    })

    ...

    [LOAD_END_USER]: (state, { payload }) => ({
        ...state,
        isLoading: false,
        hasLoaded: true,
        map: {
            ...state.map,
            [payload.id]: payload,
        }
    }),

### Hack the service

Now it's time to think at data fetching. Open `/src/features/users/users.service.js`
and integrate the following functions.

    import {
        loadStart,
        loadEnd,
        loadEndUser,
        loadFailed,
    } from './users.reducer'

    ...

    export const fetchUserAlbums = userId => async (dispatch, getState) => {
        try {
            const { ssr } = getState()
            const req = fetch(`https://jsonplaceholder.typicode.com/albums?userId=${userId}`)
            const res = await ssr.await(req)
            return await res.json()
        } catch (err) {
            return []
        }
    }

    export const fetchUserTodos = userId => async (dispatch, getState) => {
        try {
            const { ssr } = getState()
            const req = fetch(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`)
            const res = await ssr.await(req)
            return await res.json()
        } catch (err) {
            return []
        }
    }

    export const fetchUser = userId => async (dispatch, getState) => {
        try {
            const { ssr } = getState()
            const req = fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
            const res = await ssr.await(req)
            return await res.json()
        } catch (err) {
            return 
        }
    }

    export const loadUser = userId => async (dispatch) => {
        try {
            dispatch(loadStart())
            const user = await dispatch(fetchUser(userId))
            const albums = await dispatch(fetchUserAlbums(userId))
            const todos = await dispatch(fetchUserTodos(userId))
            dispatch(loadEndUser({
                ...user,
                albums,
                todos,
            }))
        } catch (err) {
            dispatch(loadFailed(err.message))
        }
    }

**NOTE:** our `UserPage` container will call `loadUser()` which makes 3 serial
_HTTP requests_.

This is not so optimized, isn't it? I bet you spot it right away and thought very
bad bad things of me :-)

Well, we will optimize this stuff in another tutorial where we will use
[GraphQL](https://graphql.org/) to minimize the HTTP hits improve this app!

### Hack the Container

It's finally UI time! Replace your dummy `UserPage` container with the following
code in `/src/features/users/UserPage.container.js`. It's not the most beautiful
component I wrote... but it gets the job done and present some data:

    import React from 'react'
    import { connect } from 'react-redux'
    import { Link } from 'react-router-dom'
    import { loadUser } from './users.service'

    const mapState = ({ users }, { match }) => ({
        user: users.map[match.params.id] || null,
    })

    const mapDispatch = { loadUser }

    const styles = {
        wrapper: {
            textAlign: 'left',
            marginLeft: 20,
            marginRight: 20,
            paddingTop: 10,
            borderTop: '4px solid #ddd',
        },
        title: {
            margin: 0,
        },
        checked: {
            textDecoration: 'line-through',
            fontStyle: 'italic',
            color: '#aaa',
        },
    }

    class UserPage extends React.Component {
        constructor (props) {
            super(props)
            const { match, user, loadUser } = this.props
            if (!user) loadUser(match.params.id)
        }

        render () {
            const { user } = this.props

            if (!user) return 'loading...'

            // awful data presentation
            // !!! it should be worked out with dumb components !!!
            return (
                <div style={styles.wrapper}>
                    <h2 style={styles.title}>{user.name}</h2>
                    <small>{user.email}</small>
                    
                    <h3>Todos:</h3>
                    <ul>
                        {user.todos.map(({ id, title, completed }) => (
                            <li
                                key={`todo-${id}`}
                                style={completed ? styles.checked : null}
                                children={title}
                            />
                        ))}
                    </ul>

                    <h3>Albums:</h3>
                    <ul>
                        {user.albums.map(({ id, title }) => (
                            <li key={`todo-${id}`}>
                                <Link to={`/album/${id}`}>{title}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )
        }
    }

    export default connect(mapState, mapDispatch)(UserPage)

**NOTE:** the `constructor()` is responsible for the data loading. This will work good in
both client and server. Please take a close look at the line:

    if (!user) loadUser(match.params.id)

**For the SSR to work properly it is important that the data loading happens just once!**

### The devil is in the detail!

You may have noticed that the splash screen in our home page seems to be way faster than the
same splash screen applied to the user's detail page. Right?

Try open `/src/features/splash/splash.listener.js` and add this code:

    ...

    {
        type: 'loadEndUser@users',
        handler: hide,
    },

    ...

We use a new redux action to set a specific user data, so we need a specific listener to handle
it and hide the splash screen as soon as the data is available.

You might also have noticed that the other listerners used a much more verbose syntax. Well, if
your handler is a simple action that doesn't require any argument you can go with this short
sintax :-)

## Run and test!

I assume that you followed all those steps while in development mode, so now it's time to hit
the production and see if the solution hold together in while server side rendering:

    npm run start:prod



