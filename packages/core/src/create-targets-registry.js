const SKIP_REGISTER_LIFECYCLE_EXTENSIONS = [
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

const createRegistry = (initialExtensions = {}, { registryName } = {}) => {
  const knownExtensions = {};

  // '$FOO'  - required reference (trigger error if not exists)
  // '$FOO?' - optional reference (returns `null` if not exists)
  const getTarget = (name) => {
    const isOptional = name.slice(-1) === '?';
    const hookName = isOptional ? name.substr(0, name.length - 1) : name;

    if (knownExtensions[hookName]) {
      return knownExtensions[hookName];
    }

    if (isOptional) {
      return null;
    }

    throw new Error(`Unknown hook "${name}"`);
  };

  // DEPRECATED: remove in v5.0.0
  const getAction = (name) => {
    console.warn(
      '[DEPRECATED] use "getTarget()" instead of "getTarget()". It will be removed in v5.0.0',
    );
    return getTarget(name);
  };

  // DEPRECATED: remove in v5.0.0
  const getHook = (name) => {
    console.warn(
      '[DEPRECATED] use "getTarget()" instead of "getHook()". It will be removed in v5.0.0',
    );
    return getAction(name);
  };

  const registerTarget = (name, value) => {
    // handle key/value input
    if (knownExtensions[name]) {
      throw new Error(`Duplicate hook "${name}"`);
    }
    knownExtensions[name] = value;
  };

  const registerTargets = (name, value) => {
    // handle a disctionary input
    if (typeof name === 'object') {
      Object.keys(name)
        .filter((key) => !SKIP_REGISTER_LIFECYCLE_EXTENSIONS.includes(key))
        .forEach((key) => registerTarget(key, name[key]));
      return;
    }

    console.warn(
      '[DEPRECATED] use "registerActions({ name: value })". The support for registering a single action is deprecated and will be remove in v5.0.0',
    );

    registerTarget(name, value);
  };

  // DEPRECATED: remove in v5.0.0
  const registerHook = (name, value) => {
    console.warn(
      '[DEPRECATED] use "registerActions()" instead of "registerHook()". It will be removed in v5.0.0',
    );
    registerTargets(name, value);
  };

  // Initialize the registry with the lifecycle Actions
  registerTargets(initialExtensions);

  // Save a global list of registries
  const registry = {
    registerTargets,
    getTarget,
    getAction, // DEPRECATED: remove in v5.0.0
    getHook, // DEPRECATED: remove in v5.0.0
    registerHook, // DEPRECATED: remove in v5.0.0
  };
  registries[registryName || `default${registries.length || ''}`] = registry;

  return registry;
};

const getTarget = (hookName, registryName = 'default') => {
  const registry = registries[registryName];
  if (!registry) {
    throw new Error(`Registry not found "${registryName}"`);
  }
  return registry.getTarget(hookName);
};

const getAction = (...args) => {
  console.warn(
    '[DEPRECATED] use "getTarget()" instead of "getHook()". It will be removed in v5.0.0',
  );
  return getTarget(...args);
};

const getHook = (...args) => {
  console.warn(
    '[DEPRECATED] use "getTarget()" instead of "getHook()". It will be removed in v5.0.0',
  );
  return getAction(...args);
};

// Test support
const resetState = () => {
  Object.keys(registries).forEach((key) => delete registries[key]);
};

module.exports = {
  createRegistry,
  getTarget,
  getAction, // DEPRECATED: remove in v5.0.0
  resetState,
  getHook, // DEPRECATED: remove in v5.0.0
};
