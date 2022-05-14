const forrest = require('../src/index');
const { resetState } = require('../src/state');

describe('Errors', () => {
  let originalLog = null;
  let fakeLog = null;
  let logMock = null;

  beforeEach(resetState);

  beforeEach(() => {
    originalLog = console.log;
    fakeLog = jest.fn();
    console.log = fakeLog;
    logMock = () => originalLog(fakeLog.mock.calls.map(($) => $[0]).join('\n'));
  });

  afterEach(() => {
    console.log = originalLog;
  });

  describe('getConfig()', () => {
    it('Should provide a meaningful error', async () => {
      await forrest.run({
        features: [
          {
            target: '$INIT_FEATURE',
            handler: ({ getConfig }) => {
              getConfig('foo', '?');
            },
          },
        ],
      });
    });
  });
});
