const pause = require('@marcopeg/utils/lib/pause');
const { resetState } = require('../src/state');
const { createExtension } = require('../src/create-extension');
const { registerAction } = require('../src/register-action');

describe('hooks/serie', () => {
  beforeEach(resetState);

  it('should run serie hooks', async () => {
    const handler = jest.fn();
    registerAction({
      target: 'foo',
      handler: async () => {
        await pause();
        handler();
      },
    });
    await createExtension('foo', { mode: 'serie' });
    expect(handler.mock.calls.length).toBe(1);
  });

  it('should run serie hooks - with helper', async () => {
    const handler = jest.fn();
    registerAction({
      target: 'foo',
      handler: async () => {
        await pause();
        handler();
      },
    });
    await createExtension.serie('foo');
    expect(handler.mock.calls.length).toBe(1);
  });
});
