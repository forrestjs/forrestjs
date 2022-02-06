const pause = require('@marcopeg/utils/lib/pause');
const { resetState } = require('../src/state');
const { createAction } = require('../src/create-action');
const { registerExtension } = require('../src/register-extension');

describe('hooks/serie', () => {
  beforeEach(resetState);

  it('should run serie hooks', async () => {
    const handler = jest.fn();
    registerExtension({
      action: 'foo',
      handler: async () => {
        await pause();
        handler();
      },
    });
    await createAction('foo', { mode: 'serie' });
    expect(handler.mock.calls.length).toBe(1);
  });

  it('should run serie hooks - with helper', async () => {
    const handler = jest.fn();
    registerExtension({
      action: 'foo',
      handler: async () => {
        await pause();
        handler();
      },
    });
    await createAction.serie('foo');
    expect(handler.mock.calls.length).toBe(1);
  });
});
