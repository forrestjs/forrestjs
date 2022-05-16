/**
 * Home Page
 * Uses the `service-env` to expose a configuration that is
 * provided to the app as an environmental variable.
 */

const envVarExists = async (request) =>
  request.getEnv('APP_01_HOME_PAGE_RETURN');

const envVarNotExists = async (request) =>
  request.getEnv('APP_01_THIS_VAR_DOES_NOT_EXISTS');

const envVarDefaults = async (request) =>
  request.getEnv('APP_01_THIS_VAR_DOES_NOT_EXISTS', 'Default Value');

module.exports = {
  name: 'home',
  target: '$FASTIFY_ROUTE',
  handler: [
    { method: 'GET', url: '/', handler: async () => 'Home' },
    { method: 'GET', url: '/env-var-exists', handler: envVarExists },
    {
      method: 'GET',
      url: '/env-var-not-exists',
      handler: envVarNotExists,
    },
    {
      method: 'GET',
      url: '/env-var-defaults',
      handler: envVarDefaults,
    },
  ],
};
