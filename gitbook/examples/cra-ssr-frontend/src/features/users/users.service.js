import { loadStart, loadEnd, loadFailed } from './users.reducer'

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
