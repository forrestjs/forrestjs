import socketIO from 'socket.io'
import { createHook, SERVICE } from '@marcopeg/hooks'
import { EXPRESS_INIT } from './hooks'
import { EXPRESS_SOCKETIO_ON_CONNECTION } from './hooks'

const initSocketIO = (io, settings = {}) =>
    io.on('connection', client =>
        createHook(EXPRESS_SOCKETIO_ON_CONNECTION, {
            args: { io, client, settings: { ...settings } },
        })
    )

export const register = ({ registerAction }) => {
    registerAction({
        hook: EXPRESS_INIT,
        name: `${SERVICE} express/socketio`,
        trace: __filename,
        handler: ({ server, settings }) => {
            initSocketIO(socketIO(server), settings.socketio)
        },
    })
}
