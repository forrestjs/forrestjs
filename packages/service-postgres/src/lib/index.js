import { INIT_SERVICE, START_SERVICE } from '@forrestjs/hooks'
import { logError } from '@forrestjs/service-logger'
import { POSTGRES_BEFORE_INIT, POSTGRES_BEFORE_START } from './hooks'

import { default as init } from './init'
import { default as start } from './start'

export { default as init } from './init'
export { default as start } from './start'
export { default as query } from './query'
export { getModel, registerModel, resetModels } from './conn'

export const register = ({ registerAction, createHook }) => {
    registerAction({
        hook: INIT_SERVICE,
        name: '→ postgres',
        trace: __filename,
        handler: async ({ postgres }) => {
            if (!postgres) {
                logError(`[postgres] missing boot configuration`)
                throw new Error(`[postgres] missing boot configuration`)
            }

            for (const options of postgres) {
                const name = `${POSTGRES_BEFORE_INIT}/${options.connectionName || 'default'}`
                createHook(name, { args: { options } })
                await init(options)
            }
        },
    })

    registerAction({
        hook: START_SERVICE,
        name: '→ postgres',
        trace: __filename,
        handler: async ({ postgres }) => {
            for (const options of postgres) {
                const name = `${POSTGRES_BEFORE_START}/${options.connectionName || 'default'}`
                createHook(name, { args: { options } })
                await start(options)
            }
        },
    })
}
