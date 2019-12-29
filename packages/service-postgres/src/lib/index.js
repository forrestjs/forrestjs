import { INIT_SERVICE, START_SERVICE } from '@forrestjs/hooks'
import * as hooks from './hooks'

import { default as init } from './init'
import { default as start } from './start'
import { getModel, resetModels } from './conn'
import { default as query } from './query'

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
        handler: async ({ getConfig }, ctx) => {
            const postgres = getConfig('postgres.connections')

            for (const options of postgres) {

                // #18 apply defaults to the models list
                if (!options.models) {
                    options.models = []
                }

                const name = `${hooks.POSTGRES_BEFORE_INIT}/${options.connectionName || 'default'}`
                createHook.sync(name, { options })
                await init(options, ctx)
            }

            // Decorate the context with the PG context
            ctx.pg = {
                query,
                getModel,
                resetModels,
            }
        },
    })

    registerAction({
        hook: START_SERVICE,
        name: hooks.SERVICE_NAME,
        trace: __filename,
        handler: async ({ getConfig }, ctx) => {
            const postgres = getConfig('postgres.connections')

            for (const options of postgres) {
                const name = `${hooks.POSTGRES_BEFORE_START}/${options.connectionName || 'default'}`
                createHook.sync(name, {
                    registerModel: model => options.models.push(model)
                })
                await start(options, ctx)
            }
        },
    })
}
