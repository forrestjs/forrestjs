const { ForrestJSUnknownTargetError } = require('./errors');

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

    throw new ForrestJSUnknownTargetError(`Unknown target "${name}"`);
  };

  // Expose all the registered extensions
  const getTargets = () => ({ ...knownExtensions });

  const registerTarget = (name, value) => {
    // handle key/value input
    if (knownExtensions[name]) {
      throw new Error(`Duplicate target "${name}"`);
    }
    knownExtensions[name] = value;
  };

  const registerTargets = (name = {}) => {
    if (typeof name !== 'object') {
      throw new Error(`registerTargets() accepts only an object`);
    }

    // handle a dictionary input
    Object.keys(name)
      .filter((key) => !SKIP_REGISTER_LIFECYCLE_EXTENSIONS.includes(key))
      .forEach((key) => registerTarget(key, name[key]));
    return;
  };

  // Initialize the registry with the lifecycle Actions
  registerTargets(initialExtensions);

  // Save a global list of registries
  const registry = {
    registerTargets,
    getTarget,
    getTargets,
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

// Test support
const resetState = () => {
  Object.keys(registries).forEach((key) => delete registries[key]);
};

module.exports = {
  createRegistry,
  getTarget,
  resetState,
};
