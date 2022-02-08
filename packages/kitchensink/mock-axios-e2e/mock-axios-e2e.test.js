const stubSettings = {
  url: 'https://api.github.com/users/marcopeg',
  response: {
    status: 200,
    response: {
      login: 'fakeUname',
      name: 'Fake Surname',
    },
  },
};

describe('mock-axios-e2e', () => {
  beforeEach(global.mockAxios.reset);
  afterEach(global.mockAxios.reset);

  it('should run without mocks', async () => {
    // The name should contain "aka"
    const r1 = await global.get('/');
    expect(r1.split('aka').length >= 2).toBe(true);

    // It should be possible to pull different usernames
    const r2 = await global.get('/?uname=defunkt');
    expect(r1 !== r2).toBe(true);
  });

  it('should mock the jokes feature', async () => {
    await global.mockAxios(stubSettings.url, stubSettings.response);

    // Run the test with the stubbed response
    const r1 = await global.get('/');
    expect(r1).toBe('fakeUname, aka: Fake Surname');

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
