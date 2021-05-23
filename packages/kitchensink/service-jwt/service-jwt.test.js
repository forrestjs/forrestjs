describe('service-jwt', () => {
  it('Should return a signed object', async () => {
    const res = await get('/');

    // A valid JWT should have 3 dots in it
    expect(res.split('.').length).toBe(3);
  });
});
