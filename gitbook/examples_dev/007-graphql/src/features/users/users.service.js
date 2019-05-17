import {
    loadStart,
    loadEnd,
    loadEndUser,
    loadFailed,
} from './users.reducer'

import { runQuery } from '../../http.lib'

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

export const loadUser = userId => async (dispatch) => {
    try {
        dispatch(loadStart())
        const query = await dispatch(runQuery(`
            query getUser ($userId: ID!) {
                user (id: $userId) { id name email }
                todos (userId: $userId) { id title completed }
                albums (userId: $userId) { id title }
            }
        `, { userId }))

        dispatch(loadEndUser({
            ...query.data.user,
            ...query.data,
        }))
    } catch (err) {
        dispatch(loadFailed(err.message))
    }
}
