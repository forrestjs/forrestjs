import loadable from 'react-loadable'
import users from './users.reducer'

// exports the features capabilities:
export const reducers = { users }
export const services = []
export const listeners = []

// exports the UI entry point asynchronously:
export const Users = loadable({
    loader: () => import(/* webpackChunkName: "Users" */'./Users.container'),
    loading: () => 'loading...'
})
