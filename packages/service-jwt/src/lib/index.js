import jwt from 'jsonwebtoken'
import * as hooks from './hooks'

let secret = null
let duration = null

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
                resolve(data)
            }
        })
    })

export const decode = (token, options) => jwt.decode(token, options)

export default ({ registerAction }) =>
    registerAction({
        hook: '$INIT_SERVICES',
        name: hooks.SERVICE_NAME,
        trace: __filename,
        handler: ({ getConfig }, ctx) => {
            secret = getConfig('jwt.secret', process.env.JWT_SECRET || '---')
            duration = getConfig('jwt.duration', process.env.JWT_DURATION || '---')

            // Automagically setup the secret in "development" or "test"
            if (secret === '---' && ['development', 'test'].includes(process.env.NODE_ENV)) {
                secret = 'forrestjs';
                console.warn(`[service-jwt] secret automagically configured because you are in "${process.env.NODE_ENV}" environment.`);
                console.warn(`[service-jwt] value: "${secret}"`);
            }
            
            // Automagically setup the duration in "development" or "test"
            if (duration === '---' && ['development', 'test'].includes(process.env.NODE_ENV)) {
                duration = '30d';
                console.warn(`[service-jwt] duration automagically configured because you are in "${process.env.NODE_ENV}" environment.`);
                console.warn(`[service-jwt] value: "${duration}"`);
            }

            // Validate configuration
            if (secret === '---') throw new Error('[service-jwt] Please configure "jwt.secret" or "process.env.JWT_SECRET"')
            if (duration === '---') throw new Error('[service-jwt] Please configure "jwt.duration" or "process.env.JWT_DURATION"')

            // Decorate the context
            ctx.jwt = { sign, verify, decode }
        },
    })

