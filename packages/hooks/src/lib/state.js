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

export const appendTrace = (id, payload) => {
    if (!state.trace[id]) {
        state.trace[id] = []
    }
    state.trace[id].push(payload)
}

export const deleteTrace = (id) => {
    delete state.trace[id]
}

export const getHook = (hook) => {
    if (!state.hooks[hook]) {
        state.hooks[hook] = []
    }
    return state.hooks[hook]
}

export const getCurrentStack = () => [...state.stack]

export const getTraceContext = (id) => state.trace[id] || []

export const getState = () => state

// this is for unit test
export const resetState = () => {
    resetHooksRegistriesState()
    state.hooks = {}
    state.trace = {}
    state.stack = []
}
