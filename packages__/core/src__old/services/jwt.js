import { INIT_SERVICES, SERVICE } from '@marcopeg/hooks'
import jwt from 'jsonwebtoken'

let secret = null
let duration = null

export const init = (settings) => {
    secret = settings.secret
    duration = settings.duration || '0s'
}

export const sign = (payload, settings = {}, customSecret = secret) =>
    new Promise((resolve, reject) => {
        const localSettings = {
            ...settings,
            expiresIn: settings.expiresIn || duration,
        }

        jwt.sign({ payload }, customSecret, localSettings, (err, token) => {
            if (err) {
                reject(err)
            } else {
                resolve(token)
            }
        })
    })

export const verify = (token, customSecret = secret) =>
    new Promise((resolve, reject) => {
        jwt.verify(token, customSecret, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(jwt.decode(token))
            }
        })
    })

export const register = ({ registerAction }) =>
    registerAction({
        hook: INIT_SERVICES,
        name: `${SERVICE} jwt`,
        trace: __filename,
        handler: ({ jwt }) => init(jwt),
    })

export default { sign, verify }
