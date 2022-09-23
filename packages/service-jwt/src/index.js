const jwt = require('jsonwebtoken');

const service = {
  trace: __filename,
  name: 'jwt',
};

let secret = null;
let duration = null;
let settings = {};

const sign = (payload, customSettings = settings, customSecret = secret) =>
  new Promise((resolve, reject) => {
    const localSettings = {
      ...customSettings,
      expiresIn: customSettings.expiresIn || duration,
    };

    jwt.sign(payload, customSecret, localSettings, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });

const verify = (token, customSecret = secret) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, customSecret, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

const decode = (token, options) => jwt.decode(token, options);

const serviceJwt = () => {
  return [
    {
      ...service,
      target: '$INIT_SERVICES',
      name: SERVICE_NAME,
      priority: 100,
      handler: (_, { getConfig, setContext }) => {
        secret = getConfig('jwt.secret', process.env.JWT_SECRET || '---');
        duration = getConfig('jwt.duration', process.env.JWT_DURATION || '---');
        settings = getConfig('jwt.settings', {});

        // Automagically setup the secret in "development" or "test"
        if (
          secret === '---' &&
          ['development', 'test'].includes(process.env.NODE_ENV)
        ) {
          secret = 'forrestjs';
          console.warn(
            `[service-jwt] secret automagically configured because you are in "${process.env.NODE_ENV}" environment.`,
          );
          console.warn(`[service-jwt] value: "${secret}"`);
        }

        // Automagically setup the duration in "development" or "test"
        if (
          duration === '---' &&
          ['development', 'test'].includes(process.env.NODE_ENV)
        ) {
          duration = '30d';
          console.warn(
            `[service-jwt] duration automagically configured because you are in "${process.env.NODE_ENV}" environment.`,
          );
          console.warn(`[service-jwt] value: "${duration}"`);
        }

        // Validate configuration
        if (secret === '---')
          throw new Error(
            '[service-jwt] Please configure "jwt.secret" or "process.env.JWT_SECRET"',
          );
        if (duration === '---')
          throw new Error(
            '[service-jwt] Please configure "jwt.duration" or "process.env.JWT_DURATION"',
          );

        // Decorate the context
        setContext('jwt', { sign, verify, decode });
      },
    },

    /**
     * Fastify Integration (optional hook)
     */
    {
      ...service,
      target: '$FASTIFY_PLUGIN?',
      name: SERVICE_NAME,
      handler: ({ decorate, decorateRequest }, { getContext }) => {
        const jwt = getContext('jwt');
        decorate('jwt', jwt);
        decorateRequest('jwt', jwt);
      },
    },

    /**
     * Fetchq Integration (optional hook)
     * Injects the `log` API into the registered workers.
     */
    {
      ...service,
      target: '$FETCHQ_DECORATE_CONTEXT?',
      name: SERVICE_NAME,
      handler: (context, { getContext }) => ({
        ...context,
        jwt: getContext('jwt'),
      }),
    },

    /**
     * Integrate with the Fastify TDD API
     */
    {
      ...service,
      target: '$FASTIFY_TDD_ROUTE?',
      name: SERVICE_NAME,
      handler: ({ registerTddRoute }) => {
        registerTddRoute({
          method: 'POST',
          url: '/jwt/sign',
          handler: (request) => {
            const { jwt } = request;
            return jwt.sign(request.body.payload);
          },
        });
        registerTddRoute({
          method: 'POST',
          url: '/jwt/verify',
          handler: (request) => {
            const { jwt } = request;
            return jwt.verify(request.body.jwt);
          },
        });
        registerTddRoute({
          method: 'POST',
          url: '/jwt/decode',
          handler: (request) => {
            const { jwt } = request;
            return jwt.decode(request.body.jwt);
          },
        });
      },
    },
  ];
};

serviceJwt.sign = sign;
serviceJwt.verify = verify;
serviceJwt.decode = decode;

module.exports = serviceJwt;
