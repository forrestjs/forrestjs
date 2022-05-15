const { registerAction } = require('../src/register-action');
const { createExtension } = require('../src/create-extension');
const { resetState } = require('../src/state');
const forrest = require('../src/index');

describe('core/create-extension', () => {
  beforeEach(resetState);

  it('should carry on a context', () => {
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

  it('should carry on a context in the App form', async () => {
    const input = 123;
    const fn = jest.fn();
    await forrest.run({
      features: [
        // Feature that creates an extension:
        ({ registerTargets }) => {
          registerTargets({ FOO: 'bar' });

          return {
            target: '$INIT_FEATURE',
            handler: ({ createExtension }) => {
              fn(createExtension('$FOO', { args: input }));
            },
          };
        },

        // Feature that only register to an extension:
        {
          target: '$FOO',
          handler: (a) => a,
        },
      ],
    });

    expect(fn.mock.calls[0][0][0][0]).toBe(input);
  });
});
