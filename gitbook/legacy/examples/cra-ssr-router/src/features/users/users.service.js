import {
    loadStart,
    loadEnd,
    loadEndUser,
    loadFailed,
} from './users.reducer'

export const loadUsers = () => async (dispatch, getState) => {
    try {
        dispatch(loadStart())
        const { ssr } = getState()
        const req = fetch('https://jsonplaceholder.typicode.com/users')
        const res = await ssr.await(req)
        const data = await res.json()
        dispatch(loadEnd(data))
    } catch (err) {
        dispatch(loadFailed(err.message))
    }
}

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
