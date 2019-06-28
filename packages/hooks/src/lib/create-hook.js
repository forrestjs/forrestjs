import { runAction, runActionSync } from './actions'
import { getState } from './state'
import { log } from './logger'
import { logTrace } from './tracer'
import { onItemError } from './errors'

const defaultOptions = {
    mode: 'sync',
    args: null,
    ctx: 'boot', // maybe rename to "scope" or "phase"?
    context: {}, // pass down utilities into any registerd action
    onError: (err) => { throw err },
    onItemError,
}

export const createHook = (name, receivedOptions = {}) => {
    const { hooks, stack } = getState()

    stack.push(name)
    const pullStack = (args) => {
        stack.pop()
        return args
    }

    const options = {
        ...defaultOptions,
        ...receivedOptions,
    }

    const actions = (hooks[name] || [])
        .filter(h => h.enabled === true)

    const writeLog = () => {
        if (options.logTrace) {
            logTrace(options.logTrace)(options.ctx)({
                title: name,
            })
        }
    }

    if (options.mode === 'parallel') {
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

    if (options.mode === 'serie') {
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

    // Edit the value of the args and return it for further iteration
    if (options.mode === 'waterfall') {
        const results = []
        let args = options.args

        actions.forEach(action => {
            const res = runActionSync(action, { ...options, args })
            results.push(res)
            args = res[0]
        })

        return {
            value: args,
            results,
        }
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
    createHook(name, { args, context, mode: 'serie' })

createHook.parallel = (name, args, context) =>
    createHook(name, { args, context, mode: 'parallel' })

createHook.waterfall = (name, args, context) =>
    createHook(name, { args, context, mode: 'waterfall' })
