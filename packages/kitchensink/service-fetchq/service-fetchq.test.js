describe('service-fetchq', () => {
  it('Should return a signed object', async () => {
    const res = await get('/');

    // A valid JWT should have 3 dots in it
    expect(res).toBe('fetchq');
  });
});
