describe('service-fastify-static', () => {
  it('Should render the default index.html', async () => {
    const res = await get(`/`);
    expect(res).toContain('index');
  });

  it('Should render a custom html file', async () => {
    const res = await get(`/info.html`);
    expect(res).toContain('info');
  });

  it('Should render a custom route', async () => {
    const res = await get(`/custom/route/foo`);
    expect(res).toBe('custom: foo');
  });
});
