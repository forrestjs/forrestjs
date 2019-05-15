/**
 * this is a wrapper service around the hashing problem
 * using MD5 is ok in development but can have serious vulnerabilities.
 *
 * the "encode" function is supposed to be used asyncronousluy so to be
 * open to further development using a better method
 */

import { INIT_SERVICES, SERVICE } from '@marcopeg/hooks'
import bcrypt from 'bcrypt-nodejs'

let salt = null

export const init = async (settings = {}) => new Promise((resolve, reject) => {
    bcrypt.genSalt(settings.rounds, (err, result) => {
        if (err) {
            reject(err)
        } else {
            salt = result
            resolve(result)
        }
    })
})

export const compare = (input, hash) => new Promise((resolve, reject) => {
    bcrypt.compare(String(input), hash, (err, isCorrect) => {
        if (err) {
            reject(err)
        } else {
            resolve(isCorrect)
        }
    })
})

export const encode = input => new Promise((resolve, reject) => {
    bcrypt.hash(String(input), salt, null, (err, hash) => {
        if (err) {
            reject(err)
        } else {
            resolve(hash)
        }
    })
})

export const register = ({ registerAction }) =>
    registerAction({
        hook: INIT_SERVICES,
        name: `${SERVICE} hash`,
        trace: __filename,
        handler: ({ hash }) => init(hash),
    })
