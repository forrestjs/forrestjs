// symbols
const CORE = '◇';
const BOOT = '♦';
const SERVICE = '→';
const FEATURE = '▶';
const SEPARATOR = ' » ';
const SYMBOLS = [CORE, BOOT, SERVICE, FEATURE];

// createHookApp lifecycle
const START = `${CORE} start`;
const SETTINGS = `${CORE} settings`;
const INIT_SERVICE = `${CORE} init::service`;
const INIT_SERVICES = `${CORE} init::services`;
const INIT_FEATURE = `${CORE} init::feature`;
const INIT_FEATURES = `${CORE} init::features`;
const START_SERVICE = `${CORE} start::service`;
const START_SERVICES = `${CORE} start::services`;
const START_FEATURE = `${CORE} start::feature`;
const START_FEATURES = `${CORE} start::features`;
const FINISH = `${CORE} finish`;

module.exports = {
  CORE,
  BOOT,
  SERVICE,
  FEATURE,
  SYMBOLS,
  SEPARATOR,
  START,
  SETTINGS,
  INIT_SERVICE,
  INIT_SERVICES,
  INIT_FEATURE,
  INIT_FEATURES,
  START_SERVICE,
  START_SERVICES,
  START_FEATURE,
  START_FEATURES,
  FINISH,
};
