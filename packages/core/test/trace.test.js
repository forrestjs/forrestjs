const forrestjs = require('../src/index');

describe('Trace', () => {
  let originalLog = null;
  let fakeLog = null;
  let logMock = null;

  beforeEach(() => {
    originalLog = console.log;
    fakeLog = jest.fn();
    console.log = fakeLog;
    logMock = () => originalLog(fakeLog.mock.calls.map(($) => $[0]).join('\n'));
  });

  afterEach(() => {
    console.log = originalLog;
  });

  it('should provide compact log trace', async () => {
    await forrestjs.run({ trace: 'compact' });
    expect(fakeLog).toHaveBeenCalled();
    // logMock();
  });

  it('should let services hook into $FINISH', async () => {
    await forrestjs.run({
      trace: 'compact',
      services: [
        {
          name: 'foo',
          target: '$FINISH',
          handler: () => console.log('fooFinish'),
        },
      ],
    });

    logMock();
    expect(fakeLog.mock.calls[0][0]).toBe('fooFinish');
  });
});
