import { SERVICE } from '@forrestjs/hooks'
export const SERVICE_NAME = `${SERVICE} posrgres`

export const POSTGRES_BEFORE_INIT = `${SERVICE_NAME}/beforeInit`
export const POSTGRES_BEFORE_START = `${SERVICE_NAME}/beforeStart`
