const { registerAction } = require('../src/register-action');
const { createExtension } = require('../src/create-extension');
const { resetState } = require('../src/state');

describe('core/create-extension', () => {
  beforeEach(resetState);

  test('hooks should carry on a context', () => {
    registerAction({
      target: 'foo',
      handler: (args, ctx) => {
        expect(args.foo).toBe(1);
        expect(ctx.foo).toBe(2);
      },
    });
    createExtension('foo', {
      args: { foo: 1 },
      context: { foo: 2 },
    });
  });
});
