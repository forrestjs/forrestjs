import { createHook } from './create-hook'
import { registerAction } from './register-action'

import * as constants from './constants'

export const createHookApp = ({ services = [], features = [], settings = {} }) =>
    async () => {
        for (const service of services) {
            if (service.register) {
                await service.register({
                    registerAction,
                    createHook,
                    settings: { ...settings },
                })
            }
        }

        await createHook(constants.START, {
            async: 'serie',
            args: { ...settings },
        })

        await createHook(constants.SETTINGS, {
            async: 'serie',
            args: { settings },
        })

        for (const feature of features) {
            if (feature.register) {
                await feature.register({
                    registerAction,
                    createHook,
                    settings: { ...settings },
                })
            }
        }

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
