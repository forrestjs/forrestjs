describe('service-fetchq', () => {
  it('should queue a document into Q1', async () => {
    const res = await get('/fetchq/append/q1/foobar');
    expect(res).toMatchObject({ subject: expect.any(String) });
  });

  it('should fail to queue into a non existing queue', async () => {
    const res = await get('/fetchq/append/queue_not_exists/foobar');
    expect(res.subject).toBe(null);
  });

  it('should retrieve a document status', async () => {
    const r1 = await get('/fetchq/append/q2/foobar');

    // Await for the queue to process the document
    // TODO: this must be replaced with the "awaitStatus" helper function
    await pause(500);

    // TODO: this must become a "/test/fetchq/status/:queue/:subject" call
    const r2 = await get(`/fetchq/status/q2/${r1.subject}`);
    expect(r2.status).toBe(3);
  });

  it('should integrate with service-fastify-healthz', async () => {
    const r1 = await rawGet('/healthz');
    expect(r1.status).toBe(200);
  });

  it('should integrate with the Fastify TDD service and offer Fetchq related query capability on GET', async () => {
    const r1 = await get('/test/fetchq/query?q=SELECT%20NOW()');
    expect(r1.rowCount).toBe(1);
    expect(typeof r1.rows[0].now).toBe('string');
  });

  it('should integrate with the Fastify TDD service and offer Fetchq related query capability on POST', async () => {
    const r1 = await post('/test/fetchq/query', { q: 'SELECT NOW()' });
    expect(r1.rowCount).toBe(1);
    expect(typeof r1.rows[0].now).toBe('string');
  });
});
