const forrest = require('../src/index');
const { resetState } = require('../src/state');

describe('Errors', () => {
  beforeEach(resetState);

  describe('getConfig()', () => {
    it('Should provide a meaningful error', async () => {
      const fn = jest.fn();
      try {
        await forrest.run({
          services: [
            {
              name: 'foobar',
              trace: 'abcde',
              target: '$START',
              handler: ({ getConfig }) => {
                getConfig('foo');
              },
            },
          ],
        });
      } catch (err) {
        fn(err);
      }

      expect(fn).toHaveBeenCalled();
      expect(fn.mock.calls[0][0].name).toBe('ForrestJSGetConfigError');
      expect(fn.mock.calls[0][0].message).toContain('getConfig()');
      expect(fn.mock.calls[0][0].target).toContain('start');
      expect(fn.mock.calls[0][0].action).toContain('foobar');
      expect(fn.mock.calls[0][0].trace).toContain('abcde');
    });
  });

  describe('getContext()', () => {
    it('Should provide a meaningful error', async () => {
      const fn = jest.fn();
      try {
        await forrest.run({
          services: [
            {
              name: 'foobar',
              trace: 'abcde',
              target: '$START',
              handler: ({ getContext }) => {
                getContext('foo');
              },
            },
          ],
        });
      } catch (err) {
        fn(err);
      }

      expect(fn).toHaveBeenCalled();
      expect(fn.mock.calls[0][0].name).toBe('ForrestJSGetContextError');
      expect(fn.mock.calls[0][0].message).toContain('getContext()');
      expect(fn.mock.calls[0][0].target).toContain('start');
      expect(fn.mock.calls[0][0].action).toContain('foobar');
      expect(fn.mock.calls[0][0].trace).toContain('abcde');
    });
  });
});
