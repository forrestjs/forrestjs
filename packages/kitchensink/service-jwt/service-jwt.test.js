describe('service-jwt', () => {
  const payload = { value: 123 };

  it('Should return a signed object', async () => {
    const signed = await global.post(`/jwt/sign`, { payload });
    const verified = await global.post(`/jwt/verify`, { signed });
    expect(verified).toMatchObject(payload);
  });

  it('should sign a payload using test api', async () => {
    const signed = await global.testPost(`/jwt/sign`, { payload });
    const verified = await global.testPost(`/jwt/verify`, { jwt: signed });
    expect(verified).toMatchObject(payload);
  });

  it('should sign a payload using test utilities', async () => {
    const signed = await global.jwt.sign(payload);
    const verified = await global.jwt.verify(signed);
    expect(verified).toMatchObject(payload);
  });
});
