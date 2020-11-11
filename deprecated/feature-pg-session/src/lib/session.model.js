import Sequelize from 'sequelize'
import * as hooks from './hooks'

export const name = 'SessionRecord'

const fields = {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    payload: {
        type: Sequelize.JSONB,
        defaultValue: {},
    },
    hits: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
    },
    validUntil: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    endedAt: {
        type: Sequelize.DATE,
    },
}

const options = {
    tableName: 'session_records',
    freezeTableName: true,
    underscored: true,
}

const upsertSession = (conn, Model) => async (id, defaults) => {
    const res = await Model.findOrCreate({
        where: { id },
        defaults,
    })
    return res[0]
}

const validateSession = (conn, Model, createHook) => async (id, validUntil) => {
    const results = await Model.update({
        validUntil,
        hits: Sequelize.literal('hits + 1'),
    }, {
        where: {
            id,
            isActive: true,
            endedAt: null,
            validUntil: { [Sequelize.Op.gte]: Sequelize.literal('NOW()') },
        },
        returning: true,
        raw: true,
    })

    const record = results[1].shift()

    // Try to mark an ended session with a timestamp
    if (!record) {
        const updates = await Model.update({
            isActive: false,
            endedAt: new Date(),
        }, {
            where: {
                id,
                endedAt: null,
            },
            returning: true,
            raw: true,
        })

        // Run cleanup hooks
        updates[0] && await createHook.serie(hooks.PG_SESSION_CLEANUP, { records: updates[1] })
    }

    return record
}

const cleanup = (conn, Model, createHook) => async () => {
    const updates = await Model.update({
        isActive: false,
        endedAt: new Date(),
    }, {
        where: {
            [Sequelize.Op.or]: [
                {
                    endedAt: null,
                    isActive: false,
                },
                {
                    endedAt: null,
                    validUntil: { [Sequelize.Op.lt]: Sequelize.literal('NOW()') },
                },
            ],
        },
        returning: true,
        raw: true,
    })

    // Run cleanup hooks
    updates[0] && await createHook.serie(hooks.PG_SESSION_CLEANUP, { records: updates[1] })

    return updates
}

// setValue('key', 'value)
// setValue({ key1: 123, key2: 'aaa' })
const setValue = (conn, Model) => (id, key, val) => {
    const data = (typeof key === 'object')
        ? key
        : { [key]: val }

    return Model.update({
        payload: Sequelize.literal(`payload || '${JSON.stringify(data)}'`),
    }, {
        where: { id },
    })
}

// getValue(id, null) -> full payload
// getValue(id, key) -> single key
const getValue = (conn, Model) => async (id, key = null) => {
    try {
        const res = await Model.findOne({
            where: { id },
            attributes: (
                key
                    ? [[ Sequelize.json(`payload.${key}`), 'value' ]]
                    : [[ 'payload', 'value' ]]
            ),
            raw: true,
        })
        return res.value
    } catch (err) {
        return undefined
    }
}

const unsetValue = (conn, Model) => async (id, keys = []) => {
    const sql = Array.isArray(keys)
        ? keys.map(key => `'${key}'`).join(' - ')
        : `'${keys}'`

    return Model.update({
        payload: Sequelize.literal(`payload  - ${sql}`),
    }, {
        where: { id },
        // logging: console.log,
    })
}

export const init = async (conn, { createHook }) => {
    await createHook.serie(hooks.PG_SESSION_INIT_MODEL, { name, fields, options, conn })

    const Model = conn.define(name, fields, options)
    Model.upsertSession = upsertSession(conn, Model)
    Model.validateSession = validateSession(conn, Model, createHook)
    Model.cleanup = cleanup(conn, Model, createHook)
    Model.setValue = setValue(conn, Model)
    Model.unsetValue = unsetValue(conn, Model)
    Model.getValue = getValue(conn, Model)

    await createHook.serie(hooks.PG_SESSION_DECORATE_MODEL, { name, fields, options, Model, conn })

    return Model.sync()
}
