const { registerAction } = require('../src/register-action');
const { createHook } = require('../src/create-hook');
const { resetState } = require('../src/state');

describe('createHook()', () => {
  beforeEach(resetState);

  test('hooks should carry on a context', () => {
    registerAction('foo', (args, ctx) => {
      expect(args.foo).toBe(1);
      expect(ctx.foo).toBe(2);
    });
    createHook('foo', {
      args: { foo: 1 },
      context: { foo: 2 },
    });
  });
});
