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
});
