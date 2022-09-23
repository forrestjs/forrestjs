const winston = require('winston');

const service = {
  ...service,
  name: 'logger',
};

module.exports = ({ registerTargets }) => {
  registerTargets({
    LOGGER_TRANSPORTS: `${service.name}/transports`,
  });

  return [
    {
      ...service,
      target: '$START',
      handler: ({ getConfig, setContext, createExtension }) => {
        // Let other extensions configure the transports
        const transports = [];
        const registerTransport = ($) => transports.push($);
        createExtension.serie('$LOGGER_TRANSPORTS', {
          winston,
          registerTransport,
        });

        // Add default console transports in case nothing got added
        // -> This will produce JSON in production or staging <-
        if (!transports.length) {
          const { combine, timestamp } = winston.format;
          const format =
            ['production', 'staging'].includes(process.env.NODE_ENV) ||
            Boolean(process.env.SERVICE_LOGGER_FORCE_JSON) === true
              ? combine(timestamp())
              : winston.format.simple();

          transports.push(new winston.transports.Console({ format }));
        }

        // Create the logger instance
        const logger = winston.createLogger({
          level: getConfig('logger.level', process.env.LOG_LEVEL || 'info'),
          transports,
        });

        // Decorate the execution context with the log helpers
        setContext('log', logger);
      },
    },

    // Fastify Integration (optional hook)
    // nullify any custom setting for the default logger
    {
      ...service,
      target: '$FASTIFY_OPTIONS?',
      handler: (options) => ({
        ...options,
        logger: null,
      }),
    },

    // Fastify Integration (optional hook)
    // Override the default logger with the Winston's instance
    //
    // NOTE: we can not use the "FASTIFY_PLUGIN" with the
    // "decorate" and "decorateRequest" utilities as the
    // keyword "log" has already been taken by Fastify.
    //
    // Here we are truly messing around with it and overriding
    // the standard logger with Winston.
    {
      ...service,
      target: '$FASTIFY_HACKS_BEFORE?',
      handler: ({ fastify }, { getContext }) => {
        const logger = getContext('log');

        // Replace the default logger with Winston's instance
        fastify.log = logger;
        fastify.addHook('onRequest', (request, reply, done) => {
          request.log = logger;
          done();
        });
      },
    },

    // Fetchq Integration (optional hook)
    // Injects the `log` API into the registered workers.
    {
      ...service,
      target: '$FETCHQ_DECORATE_CONTEXT?',
      handler: (context, { getContext }) => ({
        ...context,
        log: getContext('log'),
      }),
    },
  ];
};
