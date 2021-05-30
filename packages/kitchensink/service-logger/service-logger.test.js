describe('service-logger', () => {
  it('should log stuff', async () => {
    const res = await get('/');
    console.log(res);
    // expect(res.data.countries.length).toBeGreaterThan(1);
  });
});
