import dotted from '@marcopeg/dotted'
import { createHook } from './create-hook'
import { registerAction } from './register-action'
import { traceHook } from './tracer'

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
        const { services = [], features = [], settings = {}, context = {}, trace = null } =
            Array.isArray(appDefinition)
                ? { features: appDefinition }
                : appDefinition

        // creates initial internal settings from an object
        // or automatically register the provided settings callback
        const internalSettings = typeof settings === 'function'
            ? (() => {
                registerAction({
                    name: `${constants.BOOT} app/settings`,
                    hook: constants.SETTINGS,
                    handler: async () => {
                        const values = await settings()
                        Object.keys(values).forEach(key => {
                            internalSettings[key] = values[key]
                        })
                    },
                })
                return {}
            })()
            : settings

        // create getter and setter for the configuration
        const getConfig = (path, defaultValue) => {
            let value = undefined
            try { value = dotted(internalSettings, path) } catch (err) {}

            if (value !== undefined) {
                return value
            }

            if (defaultValue !== undefined) {
                return defaultValue
            }

            throw new Error(`[hooks] getConfig("${path}") does not exists!`)
        }
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
        scopedCreateHook.serie = (name, args) => scopedCreateHook(name, { args, mode: 'serie' })
        scopedCreateHook.parallel = (name, args) => scopedCreateHook(name, { args, mode: 'parallel' })
        scopedCreateHook.waterfall = (name, args) => scopedCreateHook(name, { args, mode: 'waterfall' })
        internalContext.createHook = scopedCreateHook

        if (trace) {
            registerAction({
                name: `${constants.BOOT} app/trace`,
                hook: constants.FINISH,
                handler: () => {
                    console.log('')
                    console.log('=================')
                    console.log('Boot Trace:')
                    console.log('=================')
                    console.log('')
                    switch (trace) {
                        case 'full':
                            console.log(traceHook()('full')('json'))
                            break
                        default:
                            console.log(traceHook()('compact')('cli').join('\n'))
                            break
                    }
                    console.log('')
                    console.log('')
                },
            })
        }

        // run lifecycle
        await runIntegrations(services, internalContext)
        await scopedCreateHook.serie(constants.START, internalContext)
        await scopedCreateHook.serie(constants.SETTINGS, internalContext)
        await runIntegrations(features, internalContext)
        await scopedCreateHook.serie(constants.INIT_SERVICE, internalContext)
        await scopedCreateHook.parallel(constants.INIT_SERVICES, internalContext)
        await scopedCreateHook.serie(constants.INIT_FEATURE, internalContext)
        await scopedCreateHook.parallel(constants.INIT_FEATURES, internalContext)
        await scopedCreateHook.serie(constants.START_SERVICE, internalContext)
        await scopedCreateHook.parallel(constants.START_SERVICES, internalContext)
        await scopedCreateHook.serie(constants.START_FEATURE, internalContext)
        await scopedCreateHook.parallel(constants.START_FEATURES, internalContext)
        await scopedCreateHook.serie(constants.FINISH, internalContext)

        return {
            settings: internalSettings,
            context: internalContext,
        }
    }

// Convenient method to skip the double function
export const runHookApp = ( ...args ) => createHookApp(...args)()
