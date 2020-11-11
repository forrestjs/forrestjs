import { FEATURE } from '@forrestjs/hooks'
export const FEATURE_NAME = `${FEATURE} pg-session`

export const PG_SESSION_INIT_MODEL = `${FEATURE_NAME}/model/init`
export const PG_SESSION_DECORATE_MODEL = `${FEATURE_NAME}/model/decorate/model`
export const PG_SESSION_DECORATE_RECORD = `${FEATURE_NAME}/model/decorate/record`
export const PG_SESSION_CLEANUP = `${FEATURE_NAME}/cleanup`
