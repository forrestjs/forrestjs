const pause = require('@marcopeg/utils/lib/pause');
const { resetState } = require('../src/state');
const { createAction } = require('../src/create-action');
const { registerAction } = require('../src/register-action');

describe('hooks/serie', () => {
  beforeEach(resetState);

  it('should run parallel hooks', async () => {
    const handler = jest.fn();
    registerAction({
      hook: 'foo',
      handler: async () => {
        await pause();
        handler();
      },
    });
    await createAction('foo', { mode: 'parallel' });
    expect(handler.mock.calls.length).toBe(1);
  });

  it('should run parallel hooks with helper', async () => {
    const spy = jest.fn();
    const handler = async () => {
      await pause();
      spy();
    };

    registerAction({
      hook: 'foo',
      handler,
    });
    registerAction(['foo', handler]);
    registerAction('foo', handler);

    await createAction.parallel('foo');
    expect(spy.mock.calls.length).toBe(3);
  });
});
