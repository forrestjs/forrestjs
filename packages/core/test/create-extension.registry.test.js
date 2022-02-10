const forrestjs = require('../src/index');
const { resetState } = require('../src/state');

describe('core/create-extension/registry', () => {
  beforeEach(resetState);

  it('Should create an extension by referencing an existing Action Target', async () => {
    const fn = jest.fn();
    await forrestjs([
      // Should declare targets and reference them while creating an Extension
      ({ registerTargets }) => {
        registerTargets({
          foo: 'foo',
        });
        return {
          target: '$INIT_SERVICE',
          handler: ({ createExtension }) => createExtension('$foo'),
        };
      },
      // Should register an Action refereincing the Target hooks
      {
        target: '$foo',
        handler: fn,
      },
    ]);

    expect(fn.mock.calls.length).toBe(1);
  });

  it('Should fail creating an action for undeclared Targets', async () => {
    const fn = jest.fn();
    try {
      await forrestjs([
        {
          target: '$INIT_SERVICE',
          handler: ({ createExtension }) => createExtension('$foobar'),
        },
      ]);
    } catch (err) {
      // console.log(err);
      fn(err);
    }

    // It should throw
    expect(fn.mock.calls.length).toBe(1);
  });
});
