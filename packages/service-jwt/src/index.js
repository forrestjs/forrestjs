const jwt = require('jsonwebtoken');
const hooks = require('./hooks');

let secret = null;
let duration = null;
let settings = {};

const sign = (payload, customSettings = settings, customSecret = secret) =>
  new Promise((resolve, reject) => {
    const localSettings = {
      ...customSettings,
      expiresIn: customSettings.expiresIn || duration,
    };

    jwt.sign({ payload }, customSecret, localSettings, (err, token) => {
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

const serviceJwt = ({ registerAction }) => {
  registerAction({
    hook: '$INIT_SERVICES',
    name: hooks.SERVICE_NAME,
    trace: __filename,
    handler: ({ getConfig }, { setContext }) => {
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
  });

  // Fastify Integration (optional hook)
  registerAction({
    hook: '$FASTIFY_HACKS_BEFORE?',
    name: hooks.SERVICE_NAME,
    trace: __filename,
    handler: ({ fastify }, { getContext }) => {
      const jwt = getContext('jwt');

      // Prepare the shape of the decorators
      fastify.decorate('jwt', jwt);
      fastify.decorateRequest('jwt', null);

      // Add the references using hooks to comply with the decoratos API
      // https://www.fastify.io/docs/v3.15.x/Decorators/

      fastify.addHook('onRequest', (request, reply, done) => {
        request.jwt = jwt;
        done();
      });
    },
  });

  /**
   * Integrate with the Fastify TDD API
   */

  registerAction({
    hook: '$FASTIFY_TDD_ROUTE?',
    name: hooks.SERVICE_NAME,
    trace: __filename,
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
  });
};

serviceJwt.sign = sign;
serviceJwt.verify = verify;
serviceJwt.decode = decode;

module.exports = serviceJwt;
