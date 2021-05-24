describe('service-fetchq', () => {
  it('Should queue a document into Q1', async () => {
    const res = await get('/fetchq/append/q1/foobar');
    expect(res).toMatchObject({ subject: expect.any(String) });
  });

  it('Should fail to queue into a non existing queue', async () => {
    const res = await get('/fetchq/append/queue_not_exists/foobar');
    expect(res.subject).toBe(null);
  });

  it('Should retrieve a document status', async () => {
    const r1 = await get('/fetchq/append/q2/foobar');

    // Await for the queue to process the document
    // TODO: this must be replaced with the "awaitStatus" helper function
    await pause(500);

    // TODO: this must become a "/test/fetchq/status/:queue/:subject" call
    const r2 = await get(`/fetchq/status/q2/${r1.subject}`);
    expect(r2.status).toBe(3);
  });
});
