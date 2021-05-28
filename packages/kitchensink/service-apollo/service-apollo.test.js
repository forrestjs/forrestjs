describe('service-apollo', () => {
  it('should load a graphql query', async () => {
    const res = await get('/');
    expect(res.data.countries.length).toBeGreaterThan(1);
  });
});
