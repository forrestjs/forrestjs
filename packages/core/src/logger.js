// memoize log level at request time because it might be loaded
// from a `.env.xxx` file at boot time
const getLogLevel = () => {
  if (!getLogLevel.cache) {
    getLogLevel.cache = String(process.env.LOG_LEVEL).toLowerCase();
  }
  return getLogLevel.cache;
};

const log = (text) => {
  if (['debug', 'silly'].indexOf(getLogLevel()) !== -1) {
    console.log(text);
  }
};

const logAction = (text, action) => {
  const name = `${action.name}@${action.hook}`;
  const trace =
    action.trace && action.trace !== 'unknown'
      ? `(origin: ${action.trace})`
      : '';
  log(`[hook] ${text} - "${name}" ${trace}`);
};

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

/**
 * Converts a log level name into a log level number
 * @param {String} level log level name
 * @param {Object} levels log levels map
 * @param {Number} defaultValue default value in case the level is not mapped
 * @returns
 */
const getLevelNumber = (level, levels = LOG_LEVELS, defaultValue = 0) =>
  levels[String(level).toLowerCase()] || defaultValue;

/**
 * Creates a logger instance that logs to the console
 * @param {String} LOG_LEVEL max level to log
 * @param {Function} transport a logger function
 * @returns
 */
const makeLogger = (
  logLevel = 'info',
  { transport = console.log, levelsMap = LOG_LEVELS } = {},
) => {
  const logNumber = getLevelNumber(logLevel, levelsMap);

  /**
   * Generic logger function
   * @param {String} level desired logger level
   * @param  {...any} args params to forward to the transport
   */
  const logger = (level, ag1, ...args) => {
    if (getLevelNumber(level, levelsMap) <= logNumber) {
      if (typeof ag1 === 'string') {
        const [ag2, ...argsRest] = args;
        if (ag2) {
          if (typeof ag2 === 'object') {
            transport(
              `${level}: ${ag1}`,
              {
                ...ag2,
                level,
              },
              ...argsRest,
            );
          } else {
            transport(
              `${level}: ${ag1}`,
              {
                level,
              },
              ag2,
              ...argsRest,
            );
          }
        } else {
          transport(`${level}: ${ag1}`, { level }, ...args);
        }
      } else {
        const { message, ...ag1Rest } = ag1;
        transport(
          `${level}: ${message}`,
          ...[
            {
              ...ag1Rest,
              level,
            },
            ...args,
          ],
        );
      }
    }
  };

  // Add the shortcut methods
  Object.keys(levelsMap).forEach((key) => {
    logger[key] = (...args) => logger(key, ...args);
  });

  return logger;
};

module.exports = { log, logAction, makeLogger, getLevelNumber, LOG_LEVELS };
