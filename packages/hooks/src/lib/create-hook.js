import { runAction, runActionSync } from './actions'
import { getState } from './state'
import { log } from './logger'
import { logTrace } from './tracer'
import { onItemError } from './errors'

const defaultOptions = {
    async: false,
    args: null,
    ctx: 'boot', // maybe rename to "scope" or "phase"?
    context: {}, // pass down utilities into any registerd action
    onError: (err) => { throw err },
    onItemError,
}

export const createHook = (name, receivedOptions = {}) => {
    const { hooks, stack } = getState()

    if (!hooks[name]) {
        log(`[hook] "${name}" is empty`)
        return []
    }

    stack.push(name)
    const pullStack = (args) => {
        stack.pop()
        return args
    }

    const options = {
        ...defaultOptions,
        ...receivedOptions,
    }

    const actions = hooks[name]
        .filter(h => h.enabled === true)

    const writeLog = () => {
        if (options.logTrace) {
            logTrace(options.logTrace)(options.ctx)({
                title: name,
            })
        }
    }

    if (options.async === 'parallel') {
        return new Promise(async (resolve, reject) => {
            try {
                const promises = actions.map(action => runAction(action, options))
                const results = await Promise.all(promises)
                writeLog()
                pullStack()
                resolve(results)
            } catch (err) {
                try {
                    resolve(options.onError(err, name, options))
                } catch (err) {
                    reject(err)
                } finally {
                    pullStack()
                }
            }
        })
    }

    if (options.async === 'serie') {
        return new Promise(async (resolve, reject) => {
            try {
                const results = []
                for (const action of actions) {
                    results.push(await runAction(action, options))
                }
                writeLog()
                pullStack()
                resolve(results)
            } catch (err) {
                try {
                    resolve(options.onError(err, name, options))
                } catch (err) {
                    reject(err)
                } finally {
                    pullStack()
                }
            }
        })
    }

    // synchronous execution with arguments
    try {
        const results = actions.map(action => runActionSync(action, options))
        writeLog()
        pullStack()
        return results
    } catch (err) {
        return pullStack(options.onError(err, name, options))
    }
}


/**
 * Helpers Shortcuts
 */

createHook.sync = (name, args, context) =>
    createHook(name, { args, context })

createHook.serie = (name, args, context) =>
    createHook(name, { args, context, async: 'serie' })

createHook.parallel = (name, args, context) =>
    createHook(name, { args, context, async: 'parallel' })
