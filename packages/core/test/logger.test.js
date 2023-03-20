const { makeLogger } = require('../src/logger');

describe('ForrestJS', () => {
  let _log = null;
  beforeEach(() => {
    _log = console.log;
    console.log = jest.fn();
    // console.log = jest.fn(_log);
  });

  afterEach(() => {
    console.log = _log;
  });

  describe('makeLogger()', () => {
    it('Should log max info', () => {
      const log = makeLogger('info');
      log.info('@info');
      log.verbose('@error');
      expect(console.log.mock.calls.length).toBe(1);
      expect(console.log.mock.calls[0][0]).toBe('info: @info');
      expect(console.log.mock.calls[0][1]).toEqual({});
    });
    it('Shoul use custom mapping', () => {
      const log = makeLogger('foo', {
        levelsMap: { foo: 1, bar: 2 },
      });
      log('foo', '@foo');
      log('bar', '@bar');
      expect(console.log.mock.calls.length).toBe(1);
      expect(console.log.mock.calls[0][0]).toBe('foo: @foo');
      expect(console.log.mock.calls[0][1]).toEqual({});
    });
    it('Should log an object', () => {
      const log = makeLogger();
      log.info({ message: '@infoObj', foo: 'bar' });
      expect(console.log.mock.calls[0][0]).toBe('info: @infoObj');
      expect(console.log.mock.calls[0][1]).toEqual({
        foo: 'bar',
      });
    });
    it('Should log a string with an object', () => {
      const log = makeLogger();
      log.info('@info', { foo: 'bar' });
      expect(console.log.mock.calls[0][0]).toBe('info: @info');
      expect(console.log.mock.calls[0][1]).toEqual({
        foo: 'bar',
      });
    });
    it('Should log a string with a scalar', () => {
      const log = makeLogger();
      log.info('@info', 'hoho');
      expect(console.log.mock.calls[0][0]).toBe('info: @info');
      expect(console.log.mock.calls[0][1]).toEqual({});
      expect(console.log.mock.calls[0][2]).toBe('hoho');
    });
  });
});
