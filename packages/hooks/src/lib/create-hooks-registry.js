const SKIP_REGISTER_HOOKS = [
    '__esModule',
    'SERVICE_NAME',
    'FEATURE_NAME',
    'CORE',
    'BOOT',
    'SERVICE',
    'FEATURE',
    'SYMBOLS',
    'SEPARATOR',
]

const registries = {}


export const createHooksRegistry = (initialHooks = {}, { registryName } = {}) => {
    const knownHooks = {}

    const getHook = (name) => {
        if (knownHooks[name]) {
            return knownHooks[name]
        }

        throw new Error(`Unknown hook "${name}"`)
    }

    const registerHook = (name, value) => {
        // handle a disctionary input
        if (typeof name === 'object') {
            Object.keys(name)
                .filter(key => !SKIP_REGISTER_HOOKS.includes(key))
                .forEach(key => registerHook(key, name[key]))
            return
        }

        // handle key/value input
        if (knownHooks[name]) {
            throw new Error(`Duplicate hook "${name}"`)
        }
        knownHooks[name] = value
    }

    registerHook(initialHooks)

    // Save a global list of registries
    const registry = { getHook, registerHook }
    registries[registryName || `default${registries.length || ''}`] = registry

    return registry
}

export const getHook = (hookName, registryName = 'default') => {
    const registry = registries[registryName]
    if (!registry) {
        throw new Error(`Registry not found "${registryName}"`)
    }
    return registry.getHook(hookName)
}

// Test support
export const resetState = () => {
    Object.keys(registries)
        .forEach(key => delete(registries[key]))
}
