const { resetState } = require('../src/state');
const forrest = require('../src/index');

describe('ForrestJS', () => {
  beforeEach(resetState);

  describe('Conditional Logger', () => {
    let _log = null;
    beforeEach(() => {
      _log = console.log;
      console.log = jest.fn();
      // console.log = jest.fn(_log);
    });

    afterEach(() => {
      console.log = _log;
    });

    it('Should shut down the logger', async () => {
      await forrest.run({
        settings: {
          logger: {
            level: 'silly',
          },
        },
        features: [
          {
            target: '$INIT_FEATURE',
            logLevel: false,
            handler: (_, { log }) => {
              log.info('Log1 - should not show');
              log.verbose('Log1 - should not show');
              log.debug('Log2 - should not show');
            },
          },
        ],
      });

      expect(console.log.mock.calls.length).toBe(0);
    });

    it('Should should log less', async () => {
      await forrest.run({
        settings: {
          logger: {
            level: 'silly',
          },
        },
        features: [
          {
            target: '$INIT_FEATURE',
            logLevel: 'info',
            handler: (_, { log }) => {
              log.info('Log1 - should not show');
              log.verbose('Log1 - should not show');
              log.debug('Log2 - should not show');
            },
          },
        ],
      });

      expect(console.log.mock.calls.length).toBe(1);
    });

    it('Should should log more', async () => {
      await forrest.run({
        settings: {
          logger: {
            level: 'error',
          },
        },
        features: [
          {
            target: '$INIT_FEATURE',
            logLevel: 'silly',
            handler: (_, { log }) => {
              log.info('Log1 - should not show');
              log.verbose('Log1 - should not show');
              log.debug('Log2 - should not show');
            },
          },
        ],
      });

      expect(console.log.mock.calls.length).toBe(3);
    });
  });
});
