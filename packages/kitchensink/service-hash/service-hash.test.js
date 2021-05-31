describe('service-hash', () => {
  it('Should return a signed object', async () => {
    const fn = jest.fn();
    const input = 'foobar';
    const hash = await get(`/encode/${input}`);

    try {
      await post(`/compare`, {
        input,
        hash,
      });
      fn(true);
    } catch (err) {
      fn(false);
    }

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(true);
  });

  it('Should return a signed object using test API', async () => {
    const fn = jest.fn();
    const payload = 'foobar';
    const hash = await post(`/test/hash/encode`, { payload });

    try {
      await post(`/test/hash/compare`, {
        payload,
        hash,
      });
      fn(true);
    } catch (err) {
      fn(false);
    }

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(true);
  });

  it('Should return a signed object using test utilities', async () => {
    const fn = jest.fn();
    const payload = 'foobar';
    const hash = await global.hash.encode(payload);

    try {
      await global.hash.compare(payload, hash);
      fn(true);
    } catch (err) {
      fn(false);
    }

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(true);
  });
});
