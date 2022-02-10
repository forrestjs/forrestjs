const pause = require('@marcopeg/utils/lib/pause');
const { resetState } = require('../src/state');
const { createExtension } = require('../src/create-extension');
const { registerAction } = require('../src/register-action');

describe('core/create-extension/serie', () => {
  beforeEach(resetState);

  it('should run parallel hooks', async () => {
    const handler = jest.fn();
    registerAction({
      target: 'foo',
      handler: async () => {
        await pause();
        handler();
      },
    });
    await createExtension('foo', { mode: 'parallel' });
    expect(handler.mock.calls.length).toBe(1);
  });

  it('should run parallel hooks with helper', async () => {
    const spy = jest.fn();
    const handler = async () => {
      await pause();
      spy();
    };

    registerAction({
      target: 'foo',
      handler,
    });
    registerAction(['foo', handler]);
    registerAction('foo', handler);

    await createExtension.parallel('foo');
    expect(spy.mock.calls.length).toBe(3);
  });
});
