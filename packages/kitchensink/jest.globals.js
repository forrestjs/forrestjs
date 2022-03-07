const fastifyTestUtils = require('@forrestjs/service-fastify/test/globals');
const fetchqTestUtils = require('@forrestjs/service-fetchq/test/globals');
const jwtTestUtils = require('@forrestjs/service-jwt/test/globals');
const pgTestUtils = require('@forrestjs/service-pg/test/globals');
const hashTestUtils = require('@forrestjs/service-hash/test/globals');

// Fastify provides the basic global functions that make
// E2E testing very easy.
//
// It's likely that other services utility functions will
// depend upon this basic package.
//
// If you want/need to override any of the utilities that
// are provided by Fastify, just pass here an object with
// your custom implementation of the specific method.
const fastifyGlobals = fastifyTestUtils({
  // pause: () => { ... my custom implementation ... }
});

module.exports = () => ({
  ...fastifyGlobals,
  ...fetchqTestUtils(fastifyGlobals),
  ...jwtTestUtils(fastifyGlobals),
  ...pgTestUtils(fastifyGlobals),
  ...hashTestUtils(fastifyGlobals),
});
