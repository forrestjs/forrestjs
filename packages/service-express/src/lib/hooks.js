import { SERVICE } from '@forrestjs/hooks'
export const SERVICE_NAME = `${SERVICE} express`

export const EXPRESS_HACKS_BEFORE = `${SERVICE_NAME}/hacks/before`
export const EXPRESS_HACKS_AFTER = `${SERVICE_NAME}/hacks/after`
export const EXPRESS_MIDDLEWARE = `${SERVICE_NAME}/middleware`
export const EXPRESS_ROUTE = `${SERVICE_NAME}/route`
export const EXPRESS_HANDLER = `${SERVICE_NAME}/handler`
