const { registerExtension } = require('../src/register-extension');
const { createAction } = require('../src/create-action');
const { resetState } = require('../src/state');

describe('createAction()', () => {
  beforeEach(resetState);

  test('hooks should carry on a context', () => {
    registerExtension('foo', (args, ctx) => {
      expect(args.foo).toBe(1);
      expect(ctx.foo).toBe(2);
    });
    createAction('foo', {
      args: { foo: 1 },
      context: { foo: 2 },
    });
  });
});
