
const handlers = {}

export const addHandler = (name, data) => {
    if (handlers[name] !== undefined) {
        throw new Error(`[postgres] handler "${name}" already defined`)
    }

    handlers[name] = {
        ...data,
        models: {},
    }
}

export const getHandler = (name) => {
    if (handlers[name] === undefined) {
        throw new Error(`[postgres] handler "${name}" does not exists`)
    }

    return handlers[name]
}

export const pushModel = (conn, model) => {
    if (conn.models[model.name] !== undefined) {
        throw new Error(`[postgres] model "${model.name}" already defined in "${conn.name}"`)
    }

    conn.models[model.name] = model
}

export const getModel = (modelName, connectionName = null) => {
    const model = Object.keys(handlers)
        .filter(item => (
            connectionName
                ? item === connectionName
                : true
        ))
        .map(name => Object.values(handlers[name].models))
        .reduce((acc, models) => [ ...acc, ...models ], [])
        .find(item => item.name === modelName)

    if (!model) {
        const connStr = connectionName
            ? `${connectionName}`
            : 'ALL CONNECTIONS'
        throw new Error(`[postgres] model not found "${modelName}" in "${connStr}"`)
    }

    return model
}

export const registerModel = async (model, connectionName = 'default') => {
    try {
        const conn = handlers[connectionName]
        const instance = await model.init(conn.handler)
        pushModel(conn, instance)
        await model.start(conn, getModel(model.name, conn.name))
    } catch (err) {
        throw new Error(`[postgres] register "${model.name}" model failed in "${connectionName}" - ${err.message}`)
    }
}

export const getHandlerNames = () => Object.keys(handlers)

export const resetModels = async (connectionName = 'default') => {
    try {
        const conn = handlers[connectionName]
        const models = Object.keys(conn.models).map(name => conn.models[name])
        const modelsToPopulate = models.filter(model => model.populate)

        // sync and populate the models
        await Promise.all(models.map(model => conn.handler.query(`TRUNCATE ${model.tableName} RESTART IDENTITY CASCADE;`)))
        await Promise.all(models.map(model => model.sync()))
        await Promise.all(modelsToPopulate.map(model => model.populate()))
    } catch (err) {
        throw new Error(`[postgres] resetModels "${connectionName}" failed - ${err.message}`)
    }
}
