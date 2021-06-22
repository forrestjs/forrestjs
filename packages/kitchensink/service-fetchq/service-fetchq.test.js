describe('service-fetchq', () => {
  beforeEach(fetchq.resetState);

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
    await fetchq.awaitDocument('q2', r1.subject);

    // Check the final status
    const r2 = await fetchq.getDocument('q2', r1.subject);
    expect(r2.status).toBe(3);
  });

  it('should fail the await status in case of timeout', async () => {
    const fn = jest.fn();
    try {
      const r1 = await get('/fetchq/append/q2/foobar');
      await fetchq.awaitDocument('q2', r1.subject, { timeout: 10 });
    } catch (err) {
      fn(err);
    }

    expect(fn.mock.calls.length).toBe(1);
    const response = fn.mock.calls[0][0].response;
    expect(response.status).toBe(412);
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

  it('should integrate the utility query method', async () => {
    const r1 = await fetchq.query('SELECT NOW()');
    expect(r1.rowCount).toBe(1);
    expect(typeof r1.rows[0].now).toBe('string');
  });

  it('should provide the lazyQuery utility method', async () => {
    setTimeout(() => get('/fetchq/push/q2/foobar'), 50);

    const res = await fetchq.lazyQuery(`
      SELECT * FROM "fetchq_data"."q2__docs"
      WHERE "subject" = 'foobar'
        AND "status" = 3
    `);

    expect(res.rowCount).toBe(1);
    expect(res.rows[0].subject).toBe('foobar');
  });

  it('should timeout lazyQuery with an error', async () => {
    const fn = jest.fn();
    const timer = setTimeout(() => get('/fetchq/push/q2/foobar'), 100);

    try {
      await fetchq.lazyQuery(
        `
      SELECT * FROM "fetchq_data"."q2__docs"
      WHERE "subject" = 'foobar'
        AND "status" = 3
    `,
        { timeout: 50 },
      );
    } catch (err) {
      fn(err);
    } finally {
      clearTimeout(timer);
    }

    expect(fn.mock.calls.length).toBe(1);
    const err = fn.mock.calls[0][0];
    expect(err.message).toBe('timeout');
  });

  it('should use JWT to sign a payload', async () => {
    await get('/fetchq/push/q3/foobar');

    const res = await fetchq.lazyQuery(
      `
      SELECT * FROM "fetchq_data"."q3__docs"
      WHERE "subject" = 'foobar'
        AND "status" = 3
      `,
    );

    const { signed, decoded, verified } = res.rows[0].payload;

    // Use JWT test API to doublecheck
    const verified1 = await global.jwt.verify(signed);
    const decoded1 = await global.jwt.decode(signed);
    expect(verified).toMatchObject(verified1);
    expect(decoded).toMatchObject(decoded1);
  });
});
