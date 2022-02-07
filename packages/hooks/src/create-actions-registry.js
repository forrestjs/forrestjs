const SKIP_REGISTER_LIFECYCLE_ACTIONS = [
  '__esModule',
  'SERVICE_NAME',
  'FEATURE_NAME',
  'CORE',
  'BOOT',
  'SERVICE',
  'FEATURE',
  'SYMBOLS',
  'SEPARATOR',
];

const registries = {};

const createActionsRegistry = (initialActions = {}, { registryName } = {}) => {
  const knownActions = {};

  // '$FOO'  - required reference (trigger error if not exists)
  // '$FOO?' - optional reference (returns `null` if not exists)
  const getAction = (name) => {
    const isOptional = name.slice(-1) === '?';
    const hookName = isOptional ? name.substr(0, name.length - 1) : name;

    if (knownActions[hookName]) {
      return knownActions[hookName];
    }

    if (isOptional) {
      return null;
    }

    throw new Error(`Unknown hook "${name}"`);
  };

  // DEPRECATED: remove in v5.0.0
  const getHook = (name) => {
    console.warn(
      '[DEPRECATED] use "getAction()" instead of "getHook()". It will be removed in v5.0.0',
    );
    return getAction(name);
  };

  const registerAction = (name, value) => {
    // handle key/value input
    if (knownActions[name]) {
      throw new Error(`Duplicate hook "${name}"`);
    }
    knownActions[name] = value;
  };

  const registerActions = (name, value) => {
    // handle a disctionary input
    if (typeof name === 'object') {
      Object.keys(name)
        .filter((key) => !SKIP_REGISTER_LIFECYCLE_ACTIONS.includes(key))
        .forEach((key) => registerAction(key, name[key]));
      return;
    }

    console.warn(
      '[DEPRECATED] use "registerActions({ name: value })". The support for registering a single action is deprecated and will be remove in v5.0.0',
    );

    registerAction(name, value);
  };

  // DEPRECATED: remove in v5.0.0
  const registerHook = (name, value) => {
    console.warn(
      '[DEPRECATED] use "registerActions()" instead of "registerHook()". It will be removed in v5.0.0',
    );
    registerActions(name, value);
  };

  // Initialize the registry with the lifecycle Actions
  registerActions(initialActions);

  // Save a global list of registries
  const registry = {
    getHook, // DEPRECATED: remove in v5.0.0
    getAction,
    registerHook, // DEPRECATED: remove in v5.0.0
    registerActions,
  };
  registries[registryName || `default${registries.length || ''}`] = registry;

  return registry;
};

const getAction = (hookName, registryName = 'default') => {
  const registry = registries[registryName];
  if (!registry) {
    throw new Error(`Registry not found "${registryName}"`);
  }
  return registry.getAction(hookName);
};

const getHook = (...args) => {
  console.warn(
    '[DEPRECATED] use "getAction()" instead of "getHook()". It will be removed in v5.0.0',
  );
  return getAction(...args);
};

// Test support
const resetState = () => {
  Object.keys(registries).forEach((key) => delete registries[key]);
};

module.exports = {
  createActionsRegistry,
  getHook, // DEPRECATED: remove in v5.0.0
  getAction,
  resetState,
};
