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

  const registerHook = (name, value) => {
    // handle a disctionary input
    if (typeof name === 'object') {
      Object.keys(name)
        .filter((key) => !SKIP_REGISTER_HOOKS.includes(key))
        .forEach((key) => registerHook(key, name[key]));
      return;
    }

    // handle key/value input
    if (knownHooks[name]) {
      throw new Error(`Duplicate hook "${name}"`);
    }
    knownHooks[name] = value;
  };

  registerHook(initialHooks);

  // Save a global list of registries
  const registry = { getHook, registerHook };
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
