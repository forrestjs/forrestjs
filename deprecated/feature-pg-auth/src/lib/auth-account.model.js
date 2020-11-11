import uuidValidate from 'uuid-validate'
import Sequelize from 'sequelize'
import { encode, compare } from '@forrestjs/service-hash'

export const name = 'AuthAccount'

const fields = {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    uname: {
        type: Sequelize.STRING,
        // allowNull: false,
        unique: true,
        // validate: {
        //     isEmail: true,
        // },
    },
    passw: {
        type: Sequelize.STRING,
        // allowNull: false,
    },
    // 0: pending
    // 1: confirmed
    // -1: deleted
    status: {
        type: Sequelize.SMALLINT,
        defaultValue: 0,
    },
    etag: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    },
    payload: {
        type: Sequelize.JSONB,
        defaultValue: {},
    },
    lastLogin: {
        type: Sequelize.DATE,
        field: 'last_login',
    },
}

const options = {
    tableName: 'auth_accounts',
    freezeTableName: true,
    underscored: true,
    hooks: {
        beforeCreate: async (user) => {
            if (user.passw) {
                user.passw = await encode(user.passw)
            }
        },
        beforeUpdate: async (user) => {
            if (user.passw) {
                user.passw = await encode(user.passw)
            }
        },
        beforeBulkUpdate: async (change) => {
            if (change.attributes.passw) {
                change.attributes.passw = await encode(change.attributes.passw)
            }
        },
    },
}

const register = (conn, Model) => (values) =>
    Model.create(values, {
        fields: [
            'uname',
            'passw',
            'status',
            'payload',
        ],
    })

const findByRef = (conn, Model) => async (ref) =>
    await Model.findOne({
        where: (
            uuidValidate(ref)
                ? { id: ref }
                : { uname: ref }
        ),
    })

const updateByRef = (conn, Model) => async (ref, values) => {
    const res = await Model.update(values, {
        where: (
            uuidValidate(ref)
                ? { id: ref }
                : { uname: ref }
        ),
        fields: [
            'uname',
            'passw',
            'status',
            'payload',
            'etag',
        ],
        returning: true,
    })

    if (!res[0]) {
        throw new Error(`[AuthAccount] ref "${ref}" now found`)
    }

    return res[1][0]
}

// "uname" could contain the real "uname" or the "id"
const findLogin = (conn, Model) => async ({ uname, passw, status = [ 0, 1 ] }) => {
    const record = await Model.findOne({
        where: {
            ...(uuidValidate(uname) ? { id: uname } : { uname }),
            status: { [Sequelize.Op.in]: status },
        },
        // logging: console.log,
    })

    if (!record) {
        return null
    }

    if (!await compare(passw, record.passw)) {
        return false
    }

    return record
}

const bumpLastLogin = (conn, Model) => async userId =>
    Model.update({
        lastLogin: Sequelize.literal('NOW()'),
    }, {
        where: { id: userId },
        // logging: console.log,
    })

export const init = (conn) => {
    const Model = conn.define(name, fields, options)
    Model.findByRef = findByRef(conn, Model)
    Model.findLogin = findLogin(conn, Model)
    Model.register = register(conn, Model)
    Model.updateByRef = updateByRef(conn, Model)
    Model.bumpLastLogin = bumpLastLogin(conn, Model)
    return Model.sync()
}
