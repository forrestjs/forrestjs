import { INIT_SERVICE, START_SERVICE } from '@forrestjs/hooks'
import { logError } from '@forrestjs/service-logger'
import * as hooks from './hooks'

import { default as init } from './init'
import { default as start } from './start'

export { default as init } from './init'
export { default as start } from './start'
export { default as query } from './query'
export { getModel, registerModel, resetModels } from './conn'

export default ({ registerHook, registerAction, createHook }) => {
    registerHook(hooks)
    
    registerAction({
        hook: INIT_SERVICE,
        name: hooks.SERVICE_NAME,
        trace: __filename,
        handler: async ({ getConfig }) => {
            const postgres = getConfig('postgres')

            for (const options of postgres) {
                const name = `${hooks.POSTGRES_BEFORE_INIT}/${options.connectionName || 'default'}`
                createHook(name, { args: { options } })
                await init(options)
            }
        },
    })

    registerAction({
        hook: START_SERVICE,
        name: hooks.SERVICE_NAME,
        trace: __filename,
        handler: async ({ getConfig }) => {
            const postgres = getConfig('postgres')

            for (const options of postgres) {
                const name = `${hooks.POSTGRES_BEFORE_START}/${options.connectionName || 'default'}`
                createHook(name, { args: { options } })
                await start(options)
            }
        },
    })
}
