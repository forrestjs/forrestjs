import { getModel } from '@forrestjs/service-postgres'
import * as hooks from './hooks'

export const addSession = (config, ctx) => async (req, res, next) => {
    const SessionRecord = getModel('SessionRecord')
    const { attributeName, autoValidate } = config

    req[attributeName].validate = async () => {
        // check that an existing running session exists
        if (!req[attributeName].id) {
            throw new Error('[pg-session] Session not started')
        }

        // create an extendable set of default values for upserting a new session
        const defaults = { id: req[attributeName].id, validUntil: req[attributeName].validUntil }
        const registerField = (key, value) => (defaults[key] = value)
        await ctx.createHook.serie(hooks.PG_SESSION_DECORATE_RECORD, { registerField, req, res })

        // try to get hold of the current session
        await SessionRecord.upsertSession(req[attributeName].id, defaults)
        const record = await SessionRecord.validateSession(req[attributeName].id, req[attributeName].validUntil)

        // generate a new session
        if (!record) {
            await req[attributeName].create()
            await SessionRecord.upsertSession(req[attributeName].id, {
                ...defaults,
                id: req[attributeName].id,
            })
            await SessionRecord.validateSession(req[attributeName].id, req[attributeName].validUntil)
        }
    }

    req[attributeName].read = (key) => {
        if (!req[attributeName].id) {
            throw new Error('[feature-session] Session not started')
        }

        return SessionRecord.getValue(req[attributeName].id, key)
    }

    req[attributeName].write = async (key, val) => {
        if (!req[attributeName].id) {
            throw new Error('[feature-session] Session not started')
        }

        await SessionRecord.setValue(req[attributeName].id, key, val)
    }

    req[attributeName].delete = async (keys) => {
        if (!req[attributeName].id) {
            throw new Error('[feature-session] Session not started')
        }

        await SessionRecord.unsetValue(req[attributeName].id, keys)
    }

    autoValidate && await req[attributeName].validate()
    next()
}
