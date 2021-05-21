const axios = require('axios');

const promiseRetry = require('promise-retry');

const url = (uri = '/', url = 'http://localhost:8080') => `${url}${uri}`;

describe('service-fastify', () => {
  // Await for target app to be available
  beforeAll(() => promiseRetry(retry => axios.get(url()).catch(retry))); // Test basic routes works fine

  ['/', '/page1', '/page2/foo', '/page3', '/page4', '/page5', '/page6', '/page7', '/page8', '/info1', '/info2', '/info3', '/info4', '/info5', '/info6', '/info7'].map(uri => it(`Should ping on "${uri}"`, async () => {
    const res = await axios.get(url(uri));
    expect(res.status).toBe(200);
  }));
  it('Should run a parametric route', async () => {
    const res = await axios.get(url('/page2/foo'));
    expect(res.data).toContain('foo');
  });
});