import { hide } from './splash.service'

export default [
    {
        type: 'loadEnd@users',
        handler: () => dispatch => dispatch(hide()),
    },
    {
        type: 'loadFailed@users',
        handler: () => dispatch => dispatch(hide()),
    },
    {
        type: 'loadEndUser@users',
        handler: hide,
    },
]
