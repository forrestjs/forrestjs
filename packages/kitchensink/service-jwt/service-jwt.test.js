describe('service-jwt', () => {
  it('Should return a signed object', async () => {
    const payload = 'foobar';
    const signed = await get(`/jwt/sign/${payload}`);
    const verified = await post(`/jwt/verify`, { signed });

    // A valid JWT should have 3 dots in it
    expect(verified.payload).toBe(payload);
  });
});
