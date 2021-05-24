describe('service-fastify-cookie', () => {
  it('Should set a cookie', async () => {
    const res = await rawGet(`/`, { withCredentials: true });
    expect(res.headers['set-cookie'].length).toBe(1);
    expect(typeof res.headers['set-cookie'][0]).toBe('string');
  });
});
