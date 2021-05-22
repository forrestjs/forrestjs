const { resetState, appendAction, getHook } = require('../src/state');

describe('state/appendAction', () => {
  beforeEach(resetState);

  it('should append a single action', () => {
    const action = {
      action: 'xxx',
      handler: () => {},
    };
    appendAction('foo', action);
    expect(getHook('foo')[0]).toBe(action);
  });

  it('should sort actions by priority', () => {
    const action1 = {
      action: 'x1',
      handler: () => {},
      priority: 1,
    };
    const action2 = {
      action: 'x2',
      handler: () => {},
      priority: 2,
    };
    appendAction('foo', action1);
    appendAction('foo', action2);
    expect(getHook('foo')[0]).toBe(action2);
  });
});
