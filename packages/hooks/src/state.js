const {
  resetState: resetHooksRegistriesState,
} = require('./create-hooks-registry');

const state = {
  hooks: {},
  trace: {},
  stack: [],
};

// sort by priority DESC
const appendAction = (hook, action) => {
  if (!state.hooks[hook]) {
    state.hooks[hook] = [];
  }
  state.hooks[hook].push(action);
  state.hooks[hook].sort((a, b) => b.priority - a.priority);
};

const appendTrace = (id, payload) => {
  if (!state.trace[id]) {
    state.trace[id] = [];
  }
  state.trace[id].push(payload);
};

const deleteTrace = (id) => {
  delete state.trace[id];
};

const getHook = (hook) => {
  if (!state.hooks[hook]) {
    state.hooks[hook] = [];
  }
  return state.hooks[hook];
};

const getCurrentStack = () => [...state.stack];

const getTraceContext = (id) => state.trace[id] || [];

const getState = () => state;

// this is for unit test
const resetState = () => {
  resetHooksRegistriesState();
  state.hooks = {};
  state.trace = {};
  state.stack = [];
};

module.exports = {
  appendAction,
  appendTrace,
  deleteTrace,
  getHook,
  getCurrentStack,
  getTraceContext,
  getState,
  resetState,
};
