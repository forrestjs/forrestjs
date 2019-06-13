import Sequelize from 'sequelize'
import { logInfo, logDebug } from '@forrestjs/service-logger'
import { addHandler } from './conn'

export default (config) => {
    logInfo('[postgres] init')
    const name = config.connectionName || 'default'
    const handler = new Sequelize(config.database, config.username, config.password, {
        dialect: 'postgres',
        host: config.host,
        port: config.port,
        logging: config.logging || logDebug,
    })

    addHandler(name, {
        name,
        config,
        handler,
    })
}
