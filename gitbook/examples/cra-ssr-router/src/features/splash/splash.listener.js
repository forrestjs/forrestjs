import { hide } from './splash.service'

export default [
    {
        type: 'loadEnd@users',
        handler: hide,
    },
    {
        type: 'loadFailed@users',
        handler: hide,
    },
    {
        type: 'loadEndUser@users',
        handler: hide,
    },
]
