const { registerExtension } = require('../src/register-extension');
const { createExtension } = require('../src/create-extension');
const { resetState } = require('../src/state');

describe('createExtension()', () => {
  beforeEach(resetState);

  test('hooks should carry on a context', () => {
    registerExtension('foo', (args, ctx) => {
      expect(args.foo).toBe(1);
      expect(ctx.foo).toBe(2);
    });
    createExtension('foo', {
      args: { foo: 1 },
      context: { foo: 2 },
    });
  });
});
