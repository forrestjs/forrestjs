const axios = require('axios');
const promiseRetry = require('promise-retry');

const url = (uri = '/', url = 'http://localhost:8080') => `${url}${uri}`;

describe('service-fastify', () => {
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

  describe('routing', () => {
    [
      '/',
      '/page1',
      '/page2/foo',
      '/page3',
      '/page4',
      '/page5',
      '/page6',
      '/page7',
      '/page8',
      '/info1',
      '/info2',
      '/info3',
      '/info4',
      '/info5',
      '/info6',
      '/info7',
    ].map((uri) =>
      it(`Should ping on "${uri}"`, async () => {
        const res = await axios.get(url(uri));
        expect(res.status).toBe(200);
      }),
    );
    it('Should run a parametric route', async () => {
      const res = await axios.get(url('/page2/foo'));
      expect(res.data).toContain('foo');
    });
  });

  describe('testing', () => {
    it('should expose a testing route', async () => {
      await axios.get(url('/test'));
    });

    it('should expose an healthz route', async () => {
      const res = await axios.get(url('/test/healthz'));
      expect(res.data).toEqual(['check1', 'check2', 'check3']);
    });

    describe('Get App Config', () => {
      it('should expose the app configuration for an existing key of type "string"', async () => {
        const res = await axios.get(url('/test/config?key=custom.string'));
        expect(res.data).toEqual({
          key: 'custom.string',
          value: 'val',
          isSet: true,
        });
      });

      it('should expose the app configuration for an existing key of type "number"', async () => {
        const res = await axios.get(url('/test/config?key=custom.number'));
        expect(res.data).toEqual({
          key: 'custom.number',
          value: 123,
          isSet: true,
        });
      });

      it('should expose the app configuration for an existing key of type "boolean(true)"', async () => {
        const res = await axios.get(
          url('/test/config?key=custom.boolean.true'),
        );
        expect(res.data).toEqual({
          key: 'custom.boolean.true',
          value: true,
          isSet: true,
        });
      });

      it('should expose the app configuration for an existing key of type "boolean(true)"', async () => {
        const res = await axios.get(
          url('/test/config?key=custom.boolean.false'),
        );
        expect(res.data).toEqual({
          key: 'custom.boolean.false',
          value: false,
          isSet: true,
        });
      });

      it('should expose the app configuration for a non existing key with a default value', async () => {
        const res = await axios.get(
          url('/test/config?key=random.key&default=foobar'),
        );
        expect(res.data).toEqual({
          key: 'random.key',
          value: 'foobar',
          default: 'foobar',
          isSet: false,
        });
      });

      it('should expose the app configuration for a non existing key ginving info', async () => {
        const res = await axios.get(url('/test/config?key=random.key'));
        expect(res.data).toEqual({
          key: 'random.key',
          isSet: false,
        });
      });
    });

    describe('Set App Config', () => {
      it('should set a configuration value in the app of type "string"', async () => {
        const r1 = await axios.post(url('/test/config'), {
          key: 'set.string',
          value: 'foobar',
        });
        expect(r1.data).toEqual({
          key: 'set.string',
          value: 'foobar',
        });
      });

      it('should set a configuration value in the app of type "number"', async () => {
        const r1 = await axios.post(url('/test/config'), {
          key: 'set.number',
          value: 123,
        });
        expect(r1.data).toEqual({
          key: 'set.number',
          value: 123,
        });
      });

      it('should set a configuration value in the app of type "boolean(true)"', async () => {
        const r1 = await axios.post(url('/test/config'), {
          key: 'set.boolean.true',
          value: true,
        });
        expect(r1.data).toEqual({
          key: 'set.boolean.true',
          value: true,
        });
      });

      it('should set a configuration value in the app of type "boolean(false)"', async () => {
        const r1 = await axios.post(url('/test/config'), {
          key: 'set.boolean.false',
          value: false,
        });
        expect(r1.data).toEqual({
          key: 'set.boolean.false',
          value: false,
        });
      });

      it('should set a configuration value in the app of "null"', async () => {
        const r1 = await axios.post(url('/test/config'), {
          key: 'set.null',
          value: null,
        });
        expect(r1.data).toEqual({
          key: 'set.null',
          value: null,
        });
      });
    });

    [('/test', '/test/t1')].map((uri) =>
      it(`Should ping on "${uri}"`, async () => {
        const res = await axios.get(url(uri));
        expect(res.status).toBe(200);
      }),
    );
  });
});
