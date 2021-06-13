const stubSettings = {
  url: 'https://official-joke-api.appspot.com/jokes/ten',
  response: {
    status: 200,
    response: [
      {
        id: 279,
        type: 'general',
        setup: 'aaa',
        punchline: 'bbb',
      },
    ],
  },
};

describe('mock-axios-e2e', () => {
  beforeEach(global.mockAxios.reset);
  afterEach(global.mockAxios.reset);

  it('should run without mocks', async () => {
    // A joke should have 2 lines
    const r1 = await global.get('/');
    expect(r1.split('\n').length >= 2).toBe(true);

    // Jokes should be randomic
    const r2 = await global.get('/');
    expect(r1 !== r2).toBe(true);
  });

  it('should mock the jokes feature', async () => {
    await global.mockAxios(stubSettings.url, stubSettings.response);

    // Run the test with the stubbed response
    const r1 = await global.get('/');
    const r1Tokens = r1.split('\n');
    expect(r1Tokens).toMatchObject(['aaa', 'bbb']);

    // Reset the stubs and try again with the normal behavior
    await global.testDelete.debug('/axios/stubs');
    const r2 = await global.get('/');
    expect(r1 !== r2).toBe(true);
  });

  it('should NOT be possible to run the same mock twice', async () => {
    const onError = jest.fn();

    await global.mockAxios(stubSettings.url, stubSettings.response);

    try {
      await global.mockAxios(stubSettings.url, stubSettings.response);
    } catch (err) {
      onError(err);
    }

    expect(onError.mock.calls.length).toBe(1);
    const err = onError.mock.calls[0][0];
    expect(err.message).toContain('400');
    expect(err.response.status).toBe(400);
  });
});
