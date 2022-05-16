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

      // console.log(fn.mock.calls[0][0]);
      expect(fn).toHaveBeenCalled();
      expect(fn.mock.calls[0][0].name).toBe('ForrestJSGetConfigError');
      expect(fn.mock.calls[0][0].message).toContain('getConfig()');
      expect(fn.mock.calls[0][0].target).toContain(forrest.START);
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

      // console.log(fn.mock.calls[0][0]);
      expect(fn).toHaveBeenCalled();
      expect(fn.mock.calls[0][0].name).toBe('ForrestJSGetContextError');
      expect(fn.mock.calls[0][0].message).toContain('getContext()');
      expect(fn.mock.calls[0][0].target).toContain(forrest.START);
      expect(fn.mock.calls[0][0].action).toContain('foobar');
      expect(fn.mock.calls[0][0].trace).toContain('abcde');
    });
  });

  describe('createExtension()', () => {
    it('Should provide a meaningful error', async () => {
      const fn = jest.fn();
      try {
        await forrest.run({
          services: [
            {
              name: 'foobar',
              trace: 'abcde',
              target: '$START',
              handler: ({ createExtension }) => {
                createExtension('$foo');
              },
            },
          ],
        });
      } catch (err) {
        fn(err);
      }

      expect(fn).toHaveBeenCalled();
      expect(fn.mock.calls[0][0].name).toBe('ForrestJSCreateExtensionError');
      expect(fn.mock.calls[0][0].message).toContain('Unknown target');
      expect(fn.mock.calls[0][0].target).toContain(forrest.START);
      expect(fn.mock.calls[0][0].action).toContain('foobar');
      expect(fn.mock.calls[0][0].trace).toContain('abcde');
    });
  });

  describe('registerAction()', () => {
    it('Should provide a meaningful error', async () => {
      const fn = jest.fn();
      try {
        await forrest.run({
          services: [
            {
              name: 'foobar',
              trace: 'abcde',
              target: '$DOES_NOT_EXISTS',
              handler: () => {},
            },
          ],
        });
      } catch (err) {
        fn(err);
      }

      // console.log(fn.mock.calls[0][0]);
      expect(fn).toHaveBeenCalled();
      expect(fn.mock.calls[0][0].name).toBe('ForrestJSRegisterActionError');
      expect(fn.mock.calls[0][0].message).toContain('Unknown target');
      expect(fn.mock.calls[0][0].target).toContain('$DOES_NOT_EXISTS');
      expect(fn.mock.calls[0][0].action).toContain('foobar');
      expect(fn.mock.calls[0][0].trace).toContain('abcde');
    });
  });
});
