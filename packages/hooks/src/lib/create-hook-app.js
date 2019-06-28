import dotted from '@marcopeg/dotted'
import { createHook } from './create-hook'
import { registerAction } from './register-action'

import * as constants from './constants'

const runIntegrations = async (integrations, context) => {
    for (const service of integrations) {
        // full module that exposes "register" as API
        if (service.register) {
            await service.register(context)

        // simple function that implements "register"
        } else if (typeof service === 'function') {
            await service(context)

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

export const createHookApp = (appDefinition = {}) =>
    async () => {
        // accepts a single param as [] of features
        const { services = [], features = [], settings = {}, context = {} } =
            Array.isArray(appDefinition)
                ? { features: appDefinition }
                : appDefinition

        // creates initial internal settings from an object
        // or automatically register the provided settings callback
        const internalSettings = typeof settings === 'function'
            ? (() => {
                registerAction(constants.SETTINGS, settings)
                return {}
            })()
            : settings

        // create getter and setter for the configuration
        const getConfig = (path) => dotted(internalSettings, path)
        const setConfig = (path, value) => {
            dotted.set(internalSettings, path, value)
            return true
        }

        // create the context with getters / setters /
        const internalContext = {
            ...context,
            getConfig,
            setConfig,
            registerAction,
        }

        // createHook scoped to the Hook App context
        const scopedCreateHook = (name, options) => createHook(name, { ...options, context: internalContext })
        scopedCreateHook.sync = (name, args) => scopedCreateHook(name, { args })
        scopedCreateHook.serie = (name, args) => scopedCreateHook(name, { args, async: 'serie' })
        scopedCreateHook.parallel = (name, args) => scopedCreateHook(name, { args, async: 'parallel' })
        internalContext.createHook = scopedCreateHook

        // run lifecycle
        await runIntegrations(services, internalContext)
        await createHook.serie(constants.START, { getConfig }, internalContext)
        await createHook.serie(constants.SETTINGS, { getConfig, setConfig }, internalContext)
        await runIntegrations(features, internalContext)
        await createHook.serie(constants.INIT_SERVICE, { getConfig }, internalContext)
        await createHook.parallel(constants.INIT_SERVICES, { getConfig }, internalContext)
        await createHook.serie(constants.INIT_FEATURE, { getConfig }, internalContext)
        await createHook.parallel(constants.INIT_FEATURES, { getConfig }, internalContext)
        await createHook.serie(constants.START_SERVICE, { getConfig }, internalContext)
        await createHook.parallel(constants.START_SERVICES, { getConfig }, internalContext)
        await createHook.serie(constants.START_FEATURE, { getConfig }, internalContext)
        await createHook.parallel(constants.START_FEATURES, { getConfig }, internalContext)
        await createHook.serie(constants.FINISH, { getConfig }, internalContext)

        return {
            settings: internalSettings,
            context: internalContext,
        }
    }

// Convenient method to skip the double function
export const runHookApp = ( ...args ) => createHookApp(...args)()
