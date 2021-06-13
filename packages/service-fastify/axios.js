/**
 * Exposes the Axios singleton created by the `service-fastify`
 * instance. This way, it is possible to use the very same
 * singleton, and mock it using moxios, all around the app.
 */

module.exports = require('axios');
