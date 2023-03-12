const forrestjs = require('@forrestjs/core');
const serviceFastify = require('@forrestjs/service-fastify');
const serviceFastifyCookie = require('@forrestjs/service-fastify-cookie');

// Application logic to set a cookie in the client
const setCookie = (request, reply) => {
  const value = Date.now();
  const options = {
    httpOnly: true,
    secure: true,
  };
  reply.setCookie('lastTime', value, options).send(`lastTime set to: ${value}`);
};

// Application logic to read a previously set cookie
const getCookie = (request, reply) => {
  if (request.cookies.lastTime) {
    const value = request.cookies.lastTime;
    reply.send(`lastTime was set to: ${value}`);
  } else {
    reply.code(500).send('Cookie was not set');
  }
};

forrestjs({
  trace: 'compact',
  settings: {
    fastify: {
      cookie: {
        secret: 'forrestjs',
      },
    },
  },
  services: [serviceFastify, serviceFastifyCookie],
  features: [
    {
      name: 'test-cookie',
      target: '$FASTIFY_ROUTE',
      handler: [
        {
          method: 'GET',
          url: '/',
          handler: setCookie,
        },
        {
          method: 'GET',
          url: '/get',
          handler: getCookie,
        },
      ],
    },
  ],
}).catch((err) => console.error(err));
