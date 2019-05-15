/**
 * Provides universal dispatchable methods for:
 *
 * - cookies
 * - localStorage
 *
 */

import * as localStorageService from './local-storage.service'
import * as cookieService from './cookie.service'

export const reducers = {
    storage: require('./storage.reducer').default,
}
export const services = []
export const listeners = []

export const localStorage = localStorageService
export const cookie = cookieService
