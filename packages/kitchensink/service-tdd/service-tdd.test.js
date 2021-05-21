const axios = require('axios');
const promiseRetry = require('promise-retry');

const url = (uri = '/', url = 'http://localhost:8080') => `${url}${uri}`;

describe('service-tdd', () => {
  // Await for target app to be available
  beforeAll(() =>
    promiseRetry((retry) =>
      axios
        .get(url())
        .catch((err) =>
          err.message.includes('ECONNREFUSED') ? retry() : true,
        ),
    ),
  );

  it('Should run the basic test route', async () => {
    const res = await axios.get(url('/test'));
    // expect(res.data).toContain('foo');
  });
});
