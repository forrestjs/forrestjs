/**
 * this is a wrapper service around the hashing problem
 * using MD5 is ok in development but can have serious vulnerabilities.
 *
 * the "encode" function is supposed to be used asyncronousluy so to be
 * open to further development using a better method
 */

const bcrypt = require('bcrypt-nodejs');

const service = {
  name: 'hash',
  trace: __filename,
};

let rounds = null;
let salt = null;

const compare = (input, hash) =>
  new Promise((resolve, reject) => {
    bcrypt.compare(String(input), hash, (err, isCorrect) => {
      if (err) {
        reject(err);
      } else {
        resolve(isCorrect);
      }
    });
  });

const encode = (input) =>
  new Promise((resolve, reject) => {
    bcrypt.hash(String(input), salt, null, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });

const genSalt = (rounds) =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(rounds, (err, result) => {
      if (err) {
        reject(err);
      } else {
        salt = result;
        resolve(result);
      }
    });
  });

const serviceBcrypt = () => [
  {
    ...service,
    target: '$INIT_SERVICES',
    priority: 100,
    handler: async ({ getConfig }, ctx) => {
      const logInfo = ctx.logInfo || console.log;

      salt = getConfig('hash.salt', process.env.HASH_SALT || '---');
      rounds = getConfig('hash.rounds', process.env.HASH_ROUNDS || '---');

      // Validate configuration
      if (rounds === '---')
        throw new Error(
          '[service-hash] Please configure "hash.rounds" or "process.env.HASH_ROUNDS"',
        );

      // Generate a random SALT if not provided by the configuration
      if (salt === '---') {
        salt = await genSalt(rounds);
        logInfo(`[service-hash] A new salt was generated: ${salt}`);
      }

      // Decorate the context with helper methods
      ctx.hash = {
        encode,
        compare,
        genSalt,
      };
    },
  },

  /**
   * Fastify Integration (optional hook)
   */
  {
    ...service,
    target: '$FASTIFY_PLUGIN?',
    handler: ({ decorate, decorateRequest }, { getContext }) => {
      const hash = getContext('hash');
      decorate('hash', hash);
      decorateRequest('hash', hash);
    },
  },

  /**
   * Integrate with the Fastify TDD API
   */
  {
    ...service,
    target: '$FASTIFY_TDD_ROUTE?',
    handler: ({ registerTddRoute }) => {
      registerTddRoute({
        method: 'POST',
        url: '/hash/encode',
        handler: (request) => {
          const { hash } = request;
          return hash.encode(request.body.payload);
        },
      });

      registerTddRoute({
        method: 'POST',
        url: '/hash/compare',
        handler: (request) => {
          const { hash } = request;
          return hash.compare(request.body.payload, request.body.hash);
        },
      });

      registerTddRoute({
        method: 'POST',
        url: '/hash/genSalt/:rounds',
        handler: (request) => {
          const { hash } = request;
          return hash.genSalt(request.params.rounds);
        },
      });
    },
  },
];

serviceBcrypt.compare = compare;
serviceBcrypt.encode = encode;
serviceBcrypt.genSalt = genSalt;

module.exports = serviceBcrypt;
