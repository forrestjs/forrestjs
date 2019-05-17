// https://jsonplaceholder.typicode.com
// data interface

const baseUrl = 'https://jsonplaceholder.typicode.com'

export const fetchUsersList = async () => {
    const res = await fetch(`${baseUrl}/users`)
    return await res.json()
}

export const fetchUserData = async (userId) => {
    const res = await fetch(`${baseUrl}/users/${userId}`)
    return res.json()
}

export const fetchUserTodos = async (userId = null) => {
    const url = `${baseUrl}/todos`
    const filter = userId !== null ? `userId=${userId}` : ''
    const res = await fetch(`${url}?${filter}`)
    return res.json()
}

export const fetchUserAlbums = async (userId = null) => {
    const url = `${baseUrl}/albums`
    const filter = userId !== null ? `userId=${userId}` : ''
    const res = await fetch(`${url}?${filter}`)
    return res.json()
}
