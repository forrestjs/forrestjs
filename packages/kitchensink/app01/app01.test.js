describe('app01', () => {
  describe('feature-home', () => {
    it('Should return content from the provided environmental variables', async () => {
      const res = await get('/env-var-exists');
      expect(res).toBe('Home Page');
    });

    it('Should be able to fallback onto the provided default value', async () => {
      const res = await get('/env-var-defaults');
      expect(res).toBe('Default Value');
    });

    it('Should throw an error in case the environmental variable does not exists', async () => {
      const fn = jest.fn();

      try {
        await rawGet('/env-var-not-exists');
      } catch (err) {
        fn(err.response);
      }

      expect(fn.mock.calls[0][0].status).toBe(500);
      expect(fn.mock.calls[0][0].data.message).toContain(
        'APP_01_THIS_VAR_DOES_NOT_EXISTS',
      );
    });
  });
});
