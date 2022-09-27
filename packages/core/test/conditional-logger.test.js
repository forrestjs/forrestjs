const { resetState } = require('../src/state');
const forrest = require('../src/index');

describe('ForrestJS', () => {
  beforeEach(resetState);

  describe('Conditional Logger', () => {
    it('Should work', async () => {
      await forrest.run({
        settings: {
          logger: {
            level: 'verbose',
          },
        },
        features: [
          {
            target: '$INIT_FEATURE',
            handler: (_, { log }) => {
              log.verbose('Foo');
            },
          },
        ],
      });
    });
  });
});
