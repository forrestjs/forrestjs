import { createHook } from './create-hook'
import { registerAction } from './register-action'

import * as constants from './constants'

const runIntegrations = async (integrations, settings) => {
    for (const service of integrations) {
        // full module that exposes "register" as API
        if (service.register) {
            await service.register({
                registerAction,
                createHook,
                settings: { ...settings },
            })

        // simple function that implements "register"
        } else if (typeof service === 'function') {
            await service({
                registerAction,
                createHook,
                settings: { ...settings },
            })

        // register a single action as a feature
        // [ hookName, handler, { otherOptions }]
        } else if (Array.isArray(service)) {
            const [ hook, handler, options = {} ] = service
            registerAction({
                ...options,
                hook,
                handler,
            })
        }
    }
}

export const createHookApp = ({ services = [], features = [], settings = {} } = {}) =>
    async () => {
        await runIntegrations(services, settings)

        await createHook(constants.START, {
            async: 'serie',
            args: { ...settings },
        })

        await createHook(constants.SETTINGS, {
            async: 'serie',
            args: { settings },
        })

        await runIntegrations(features, settings)

        await createHook(constants.INIT_SERVICE, {
            async: 'serie',
            args: { ...settings },
        })

        await createHook(constants.INIT_SERVICES, {
            async: 'parallel',
            args: { ...settings },
        })

        await createHook(constants.INIT_FEATURE, {
            async: 'serie',
            args: { ...settings },
        })

        await createHook(constants.INIT_FEATURES, {
            async: 'parallel',
            args: { ...settings },
        })

        await createHook(constants.START_SERVICE, {
            async: 'serie',
            args: { ...settings },
        })

        await createHook(constants.START_SERVICES, {
            async: 'parallel',
            args: { ...settings },
        })

        await createHook(constants.START_FEATURE, {
            async: 'serie',
            args: { ...settings },
        })

        await createHook(constants.START_FEATURES, {
            async: 'parallel',
            args: { ...settings },
        })

        await createHook(constants.FINISH, {
            async: 'serie',
            args: { ...settings },
        })
    }

// Convenient method to skip the double function
export const runHookApp = ( ...args ) => createHookApp(...args)()
