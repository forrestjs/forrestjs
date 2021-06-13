# mock-axios-e2e

Often our software makes HTTP to some upstream service.  
Testing those may be tricky.

Our solution is to always use [Axios](https://www.npmjs.com/package/axios) to run our HTTP requests, so that we can easily
use [Moxios](https://www.npmjs.com/package/moxios) to mock it.

## Mocking Internal Calls

Let's say you have a ForrestJS feature that call an upstream API:

```js
const myFeature = {
  hook: '$FASTIFY_GET',
  handler: {
    url: '/multiply/:input',
    handler: (request, reply) => {
      // Gather information from the outside world:
      const r1 = await request.axios.get('http://my-api.com');
      const multiplyFactor = Number(r1.data);
      const multiplyInput = Number(request.params.input);

      // Custom testable logic:
      const resultNumber = multiplyInput * multiplyFactor;
      reply.send(resultNumber);
    },
  },
};
```

When we write a meaningful test, we would like to test the App's
custom logic, without the influence of external factors.

```js
describe('My Wonderful Feature', () => {
  afterEach(global.mockAxios.reset);

  it('should mock my HTTP call', async () => {
    await global.mockAxios('http://my-api.com', {
      status: 200,
      responseText: '3',
    });

    const r1 = await global.get('/multiply/2');
    expect(r1).toBe(6);
  });
});
```

## Axios is provided by "service-fastify"

One tricky detail about mocking Axios with Moxios is that you
should use the same Axios instance all around your app AND tests.

When independent packages use their own local Axios copy, things
will break and your mocks won't work.

`service-fastify` facilitate sharing the same Axios instance by
exposing it for a `require` or `import`:

```js
const axios = require('@forrestjs/service-fastify/axios');
axios.get('http://my-api.com');
```

And by decorating your Fastify's instance and `request` object with it:

```js
const routeHandle = async (request, reply) => {
  const r1 = await request.axios.get('http://my-api.com');
  reply.send(r1.data);
};
```

By using Axios from `service-fastify` you make your life a lot easier when it come to mocking it!
