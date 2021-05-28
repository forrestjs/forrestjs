describe('service-fastify-gql', () => {
  it('should load a graphql query', async () => {
    const res = await get('/');
    expect(res.message).toBe('+ok');
  });
});
