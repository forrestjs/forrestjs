describe('service-fastify-healthz', () => {
  it('Should render the default healthcheck route', async () => {
    const res = await get(`/healthz`);
    // expect(res).toContain('index');
  });
});
