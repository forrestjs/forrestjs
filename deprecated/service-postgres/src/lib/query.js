import { getHandler } from './conn'

export default (q, s, connectionName = 'default') =>
    getHandler(connectionName).handler.query(q, s)
