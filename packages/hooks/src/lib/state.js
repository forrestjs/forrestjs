import { resetState as resetHooksRegistriesState } from './create-hooks-registry'

const state = {
    hooks: {},
    trace: {},
    stack: [],
}

// sort by priority DESC
export const appendAction = (hook, action) => {
    if (!state.hooks[hook]) {
        state.hooks[hook] = []
    }
    state.hooks[hook].push(action)
    state.hooks[hook].sort((a, b) => b.priority - a.priority)
}

export const appendTrace = (ctx, payload) => {
    if (!state.trace[ctx]) {
        state.trace[ctx] = []
    }
    state.trace[ctx].push(payload)
}

export const deleteTrace = (ctx) => {
    delete state.trace[ctx]
}

export const getHook = (hook) => {
    if (!state.hooks[hook]) {
        state.hooks[hook] = []
    }
    return state.hooks[hook]
}

export const getCurrentStack = () => [...state.stack]

export const getTraceContext = (ctx) => state.trace[ctx] || []

export const getState = () => state

// this is for unit test
export const resetState = () => {
    resetHooksRegistriesState()
    state.hooks = {}
    state.trace = {}
    state.stack = []
}
