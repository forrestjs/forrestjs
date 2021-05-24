describe('service-fastify-cors', () => {
  it('Should render a custom route', async () => {
    const res = await get(`/custom/route/foo`);
    expect(res).toBe('custom: foo');
  });
});
