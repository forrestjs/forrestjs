import { SERVICE } from '@forrestjs/hooks'
export const SERVICE_NAME = `${SERVICE} postgres`

export const POSTGRES_BEFORE_INIT = `${SERVICE_NAME}/before/init`
export const POSTGRES_BEFORE_START = `${SERVICE_NAME}/before/start`
export const POSTGRES_AFTER_INIT = `${SERVICE_NAME}/after/init`
export const POSTGRES_AFTER_START = `${SERVICE_NAME}/after/start`
