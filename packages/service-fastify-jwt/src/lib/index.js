const fp = require('fastify-plugin');
const jwtPlugin = require('fastify-jwt');
const hooks = require('./hooks');

let options = null;

const onInitServices = ({ getConfig }) => {
  // Register plugin
  options = getConfig('fastify.jwt', {});

  // Automagically setup the secret in "development" or "test"
  if (!options.secret && ['development', 'test'].includes(process.env.NODE_ENV)) {
    options.secret = 'forrestjs';
    console.warn(`[service-fastify-jwt] secret automagically configured because you are in "${process.env.NODE_ENV}" environment.`);
    console.warn(`[service-fastify-jwt] value: "${options.secret}"`);
  }

  // Hard error in case there is no secret setup:
  if (!options.secret) {
    throw new Error('[service-fastify-jwt] missing secret!')
  }
}

const onFastifyPlugin = ({ registerPlugin }) => {
  const decoratedJwtPlugin = async fastify => {
    fastify.register(jwtPlugin, options);

    // Decorate the request object with the global jwt utilities
    fastify.addHook('onRequest', (request, reply, done) => {
      request.jwt = fastify.jwt;
      done();
    });
  };

  registerPlugin(fp(decoratedJwtPlugin));
};

module.exports = ({ registerAction }) => {
  registerAction({
    hook: '$INIT_SERVICES',
    name: hooks.SERVICE_NAME,
    trace: __filename,
    handler: onInitServices,
  });

  registerAction({
    hook: '$FASTIFY_PLUGIN',
    name: hooks.SERVICE_NAME,
    trace: __filename,
    handler: onFastifyPlugin,
  });
};
