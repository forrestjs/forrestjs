/**
 * Provides ways to use and sense the network
 *
 */

import * as networkStatusService from './services/network-status.service'
import * as fetchService from './services/fetch.service'
import * as graphqlService from './services/graphql.service'

export const reducers = {
    network: require('./network.reducer').default,
}
export const services = [
    networkStatusService,
    fetchService,
    graphqlService,
]
export const listeners = []

export { postJSON } from './services/fetch.service'
export { runQuery } from './services/graphql.service'
export { default as Online } from './Online'
export { default as Offline } from './Offline'
