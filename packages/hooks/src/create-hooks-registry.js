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
];

const registries = {};

const createHooksRegistry = (initialHooks = {}, { registryName } = {}) => {
  const knownHooks = {};

  // '$FOO'  - required reference (trigger error if not exists)
  // '$FOO?' - optional reference (returns `null` if not exists)
  const getHook = (name) => {
    const isOptional = name.slice(-1) === '?';
    const hookName = isOptional ? name.substr(0, name.length - 1) : name;

    if (knownHooks[hookName]) {
      return knownHooks[hookName];
    }

    if (isOptional) {
      return null;
    }

    throw new Error(`Unknown hook "${name}"`);
  };

  const registerAction = (name, value) => {
    // handle key/value input
    if (knownHooks[name]) {
      throw new Error(`Duplicate hook "${name}"`);
    }
    knownHooks[name] = value;
  };

  const registerActions = (name, value) => {
    // handle a disctionary input
    if (typeof name === 'object') {
      Object.keys(name)
        .filter((key) => !SKIP_REGISTER_HOOKS.includes(key))
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
  registerActions(initialHooks);

  // Save a global list of registries
  const registry = { getHook, registerHook, registerActions };
  registries[registryName || `default${registries.length || ''}`] = registry;

  return registry;
};

const getHook = (hookName, registryName = 'default') => {
  const registry = registries[registryName];
  if (!registry) {
    throw new Error(`Registry not found "${registryName}"`);
  }
  return registry.getHook(hookName);
};

// Test support
const resetState = () => {
  Object.keys(registries).forEach((key) => delete registries[key]);
};

module.exports = {
  createHooksRegistry,
  getHook,
  resetState,
};
