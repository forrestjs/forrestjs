const { createExtension } = require('../src/create-extension');
const { registerExtension } = require('../src/register-extension');
const { resetState } = require('../src/state');

describe('hook waterfall', () => {
  beforeEach(resetState);

  test('waterfall should return its own arguments', () => {
    const res = createExtension('foo', {
      mode: 'waterfall',
      args: { port: 8080 },
    });

    expect(res.value.port).toBe(8080);
  });

  test('waterfall should let extensions play with scalar arguments', () => {
    const ext = (num) => num + 1;
    registerExtension('foo', ext);
    registerExtension('foo', ext);

    const res = createExtension.waterfall('foo', 1);
    expect(res.value).toBe(3);
  });

  test('waterfall should let extensions play with object arguments', () => {
    const ext = ({ num }) => ({ num: num + 1 });
    registerExtension('foo', ext);
    registerExtension('foo', ext);

    const res = createExtension.waterfall('foo', { num: 1 });
    expect(res.value.num).toBe(3);
  });
});
