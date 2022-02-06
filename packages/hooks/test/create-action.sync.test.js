const { resetState } = require('../src/state');
const { createAction } = require('../src/create-action');
const { registerExtension } = require('../src/register-extension');

describe('hooks/sync', () => {
  beforeEach(resetState);

  it('should run hooks', () => {
    const handler = jest.fn();
    registerExtension({
      action: 'foo',
      handler,
    });
    createAction('foo');
    expect(handler.mock.calls.length).toBe(1);
  });

  it('should log action names', () => {
    const ac1 = { action: 'foo', name: 'ac1', handler: () => 22 };
    const ac2 = {
      action: 'foo',
      handler: function ac2() {
        return 23;
      },
    };

    registerExtension(ac1);
    registerExtension(ac2);

    const results = createAction('foo');

    expect(results[0][0]).toBe(22);
    expect(results[0][1].name).toBe('ac1');
    expect(results[1][0]).toBe(23);
    expect(results[1][1].name).toBe('ac2');
  });

  it('should run sync hooks with helper function', () => {
    const handler = jest.fn();
    registerExtension({
      action: 'foo',
      handler,
    });
    createAction.sync('foo');
    expect(handler.mock.calls.length).toBe(1);
  });
});
