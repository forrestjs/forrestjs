import { getModel } from '@forrestjs/service-postgres'
import { logout } from './auth-account.lib'

export const addAuth = (config, ctx) => (req, res, next) => {
    const AuthAccount = getModel('AuthAccount')
    req.auth = {}

    req.auth.validate = async () => {
        const { auth_id: authId, auth_etag: authEtag } = await req.session.get()
        if (!authId) return null

        // Try to fetch the account record and verify that it is still valid
        // based on status and login etag.
        const record = await AuthAccount.findByRef(authId)
        if (!record || record.status === -1 || record.etag !== authEtag) return null

        // Store the authentication record instance in the request for
        // later data manipulation.
        req.auth.record = record
        return record.dataValues
    }

    req.auth.logout = () => logout(req, res)

    next()
}
