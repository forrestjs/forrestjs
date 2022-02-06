const { registerAction } = require('../src/register-action');
const { createAction } = require('../src/create-action');
const { resetState } = require('../src/state');

describe('createAction()', () => {
  beforeEach(resetState);

  test('hooks should carry on a context', () => {
    registerAction('foo', (args, ctx) => {
      expect(args.foo).toBe(1);
      expect(ctx.foo).toBe(2);
    });
    createAction('foo', {
      args: { foo: 1 },
      context: { foo: 2 },
    });
  });
});
