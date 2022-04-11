describe('service-pg-standalone', () => {
  beforeEach(global.reset);

  it('should expose db data via API', async () => {
    const data = await global.get('/names');
    expect(Array.isArray(data)).toBe(true);
    expect(data[0]).toHaveProperty('uname', 'luke');
  });

  it('should expose a test query facility', async () => {
    const res = await global.pg.query(
      'SELECT * FROM "service_pg"."names" WHERE "uname" = $1',
      ['luke'],
    );
    expect(Array.isArray(res.rows)).toBe(true);
    expect(res.rows[0]).toHaveProperty('uname', 'luke');
  });
});
