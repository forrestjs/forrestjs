import Sequelize from 'sequelize'
import requestIp from 'request-ip'
import { FEATURE_NAME } from './hooks'

export const register = ({ registerAction, createHook }) => {
    registerAction({
        hook: '$PG_SESSION_INIT_MODEL',
        name: FEATURE_NAME,
        trace: __filename,
        handler: ({ fields }) => {
            fields.ip = {
                type: Sequelize.STRING,
                allowNull: false,
            }
            fields.ua = {
                type: Sequelize.STRING,
                allowNull: false,
            }
        },
    })

    registerAction({
        hook: '$PG_SESSION_DECORATE_RECORD',
        name: FEATURE_NAME,
        trace: __filename,
        handler: ({ registerField, req }) => {
            registerField('ip', requestIp.getClientIp(req))
            registerField('ua', req.get('User-Agent'))
        },
    })
}
