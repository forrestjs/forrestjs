/**
 * Exposes the Moxios singleton created by the `service-fastify`
 * instance. This way, it is possible to use the very same
 * singleton to mock the globally shared Axios one.
 */

module.exports = require('moxios');
