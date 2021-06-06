describe('service-fastify-standalone', () => {
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
        const res = await rawGet(uri);
        expect(res.status).toBe(200);
      }),
    );
    it('Should run a parametric route', async () => {
      const res = await get('/page2/foo');
      expect(res).toContain('foo');
    });
  });

  describe('testing', () => {
    it('should expose a customizable testing route with custom checks', async () => {
      const res = await testGet('/');
      expect(res).toBe('custom response');
    });

    it('should fail the test route if a specific condition is met by a tdd check middleware', async () => {
      const fn = jest.fn();
      try {
        await testRawGet('/', { headers: { foobar: true } });
      } catch (err) {
        fn(err.response.status, err.response.data);
      }

      expect(fn.mock.calls[0][0]).toBe(418);
      expect(fn.mock.calls[0][1]).toBe('oops');
    });

    describe('Get App Config', () => {
      it('should expose the app configuration for an existing key of type "string"', async () => {
        const res = await testGet('/config?key=custom.string');
        expect(res).toEqual({
          key: 'custom.string',
          value: 'val',
          isSet: true,
        });
      });

      it('should expose the app configuration for an existing key of type "number"', async () => {
        const res = await testGet('/config?key=custom.number');
        expect(res).toEqual({
          key: 'custom.number',
          value: 123,
          isSet: true,
        });
      });

      it('should expose the app configuration for an existing key of type "boolean(true)"', async () => {
        const res = await testGet('/config?key=custom.boolean.true');
        expect(res).toEqual({
          key: 'custom.boolean.true',
          value: true,
          isSet: true,
        });
      });

      it('should expose the app configuration for an existing key of type "boolean(true)"', async () => {
        const res = await testGet('/config?key=custom.boolean.false');
        expect(res).toEqual({
          key: 'custom.boolean.false',
          value: false,
          isSet: true,
        });
      });

      it('should expose the app configuration for a non existing key with a default value', async () => {
        const res = await testGet('/config?key=random.key&default=foobar');
        expect(res).toEqual({
          key: 'random.key',
          value: 'foobar',
          default: 'foobar',
          isSet: false,
        });
      });

      it('should expose the app configuration for a non existing key ginving info', async () => {
        const res = await testGet('/config?key=random.key');
        expect(res).toEqual({
          key: 'random.key',
          isSet: false,
        });
      });
    });

    describe('Set App Config', () => {
      it('should set a configuration value in the app of type "string"', async () => {
        const r1 = await testPost('/config', {
          key: 'set.string',
          value: 'foobar',
        });
        expect(r1).toEqual({
          key: 'set.string',
          value: 'foobar',
        });
      });

      it('should set a configuration value in the app of type "number"', async () => {
        const r1 = await testPost('/config', {
          key: 'set.number',
          value: 123,
        });
        expect(r1).toEqual({
          key: 'set.number',
          value: 123,
        });
      });

      it('should set a configuration value in the app of type "boolean(true)"', async () => {
        const r1 = await testPost('/config', {
          key: 'set.boolean.true',
          value: true,
        });
        expect(r1).toEqual({
          key: 'set.boolean.true',
          value: true,
        });
      });

      it('should set a configuration value in the app of type "boolean(false)"', async () => {
        const r1 = await testPost('/config', {
          key: 'set.boolean.false',
          value: false,
        });
        expect(r1).toEqual({
          key: 'set.boolean.false',
          value: false,
        });
      });

      it('should set a configuration value in the app of "null"', async () => {
        const r1 = await testPost('/config', {
          key: 'set.null',
          value: null,
        });
        expect(r1).toEqual({
          key: 'set.null',
          value: null,
        });
      });
    });

    [('/', '/t1')].map((uri) =>
      it(`Should ping on "${uri}"`, async () => {
        const res = await testRawGet(uri);
        expect(res.status).toBe(200);
      }),
    );
  });

  it('should get/set config', async () => {
    const r1 = await global.getConfig('foo');
    expect(r1).toMatchObject({ key: 'foo', isSet: false });

    const r2 = await global.getConfig('foo', 'aaa');
    expect(r2).toMatchObject({ key: 'foo', isSet: false, value: 'aaa' });

    const r3 = await global.setConfig('foo', 'bbb');
    expect(r3).toMatchObject({ key: 'foo', value: 'bbb' });

    const r4 = await global.getConfig('foo');
    expect(r4).toMatchObject({ key: 'foo', isSet: true, value: 'bbb' });
  });

  it('should mock a config and reset it', async () => {
    // Create a random configuration value that will be mocked during the test
    const r1 = await global.setConfig('foobar', 123);
    const r2 = await global.getConfig('foobar');
    expect(r1.key).toEqual(r2.key);
    expect(r1.value).toEqual(r2.value);

    // Set the mock and test it
    const resetMock = await global.mockConfig('foobar', 'aaa');
    const r3 = await global.getConfig('foobar');
    expect(resetMock.original.key).toBe(r2.key);
    expect(resetMock.original.value).toBe(r2.value);
    expect(resetMock.current.key).toBe(r3.key);
    expect(resetMock.current.value).toBe(r3.value);

    // Reset the mock and check the consistency of the value
    const r4 = await resetMock();
    expect(r4.key).toEqual(r2.key);
    expect(r4.value).toEqual(r2.value);
  });

  it('Should mock multiple configurations at the time', async () => {
    // Set a bunch of config
    await global.testPost('/config', { key: 'test.f1', value: 111 });
    await global.testPost('/config', { key: 'test.f2', value: 222 });
    await global.testPost('/config', { key: 'test.f3', value: 333 });
    const r1 = await global.getConfig('test');
    expect(r1.value).toMatchObject({ f1: 111, f2: 222, f3: 333 });

    // Mock a bunch of configs
    await mockConfig('test.f1', 'a1');
    await mockConfig('test.f2', 'a2');
    await mockConfig('test.f3', 'a3');
    const r2 = await global.getConfig('test');
    expect(r2.value).toMatchObject({ f1: 'a1', f2: 'a2', f3: 'a3' });

    // Should reset all the mocked values
    await mockConfig.reset();
    const r3 = await global.getConfig('test');
    expect(r3.value).toMatchObject(r1.value);
  });

  it('should apply a default value to a post requests when using the test api', async () => {
    await global.testPost('/t1');
  });
});
