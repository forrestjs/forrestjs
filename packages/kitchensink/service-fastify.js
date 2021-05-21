const {
  runHookApp
} = require('@forrestjs/hooks');

const serviceFastify = require('@forrestjs/service-fastify');

const homePage = ({
  registerAction
}) => {
  registerAction({
    hook: '$FASTIFY_ROUTE',
    name: 'homePage',
    handler: ({
      registerRoute
    }) => {
      registerRoute({
        method: 'GET',
        url: '/',
        handler: (request, reply) => {
          reply.send('Hello1');
        }
      });
      return [{
        method: 'GET',
        url: '/home',
        handler: (request, reply) => {
          reply.send('Hello2');
        }
      }];
    }
  });
};

const infoPage = ({
  registerAction
}) => {
  registerAction({
    hook: '$FASTIFY_GET',
    name: 'infoPage',
    handler: ({
      registerRoute
    }) => {
      registerRoute('/info', (request, reply) => {
        reply.send('Info');
      });
    }
  });
};

const utilPage = ({
  registerAction
}) => {
  registerAction({
    hook: '$FASTIFY_GET',
    name: 'utilPage',
    handler: () => ({
      url: '/util',
      handler: (request, reply) => reply.send('util')
    })
  });
};

const multiPages = ({
  registerAction
}) => {
  registerAction({
    hook: '$FASTIFY_GET',
    name: 'multiPages',
    handler: () => [{
      url: '/m1',
      handler: (request, reply) => reply.send('m1')
    }, {
      url: '/m2',
      handler: (request, reply) => reply.send('m2')
    }]
  });
};

runHookApp({
  trace: 'compact',
  services: [serviceFastify],
  features: [homePage, infoPage, utilPage, multiPages]
}).catch(err => console.error(err));