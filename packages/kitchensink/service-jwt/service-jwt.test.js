describe('service-jwt', () => {
  it('Should return a signed object', async () => {
    const payload = 'foobar';
    const signed = await get(`/jwt/sign/${payload}`);
    const verified = await post(`/jwt/verify`, { signed });

    // A valid JWT should have 3 dots in it
    expect(verified.payload).toBe(payload);
  });

  it('should sign a payload using test api', async () => {
    const payload = 'foobar';
    const signed = await post(`/test/jwt/sign`, { payload });
    const verified = await post(`/test/jwt/verify`, { jwt: signed });

    // A valid JWT should have 3 dots in it
    expect(verified.payload).toBe(payload);
  });

  it('should sign a payload using test utilities', async () => {
    const payload = 'foobar';
    const signed = await jwt.sign(payload);
    const verified = await jwt.verify(signed);

    // A valid JWT should have 3 dots in it
    expect(verified.payload).toBe(payload);
  });
});
