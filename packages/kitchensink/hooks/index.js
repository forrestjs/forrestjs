const forrestjs = require('@forrestjs/hooks');

/**
 * This feature uses the `registerAction()` pattern and provides
 * a custom `name` that is shown in the boot trace.
 */
const ft1 = ({ registerAction }) =>
  registerAction({
    name: 'ft1',
    hook: '$INIT_FEATURE',
    handler: () => console.log('ft1'),
  });

/**
 * This feature uses the `registerAction()` pattern as well, but
 * its name is derived by the function name's automatically
 */
const ft2 = ({ registerAction }) =>
  registerAction({
    hook: '$INIT_FEATURE',
    handler: () => console.log('ft2'),
  });

/**
 * This feature returns a single action to be registered in the form
 * of its configuration object.
 *
 * The feature's name can be derived by the function name.
 */
const ft3 = () => ({
  hook: '$INIT_FEATURE',
  handler: () => console.log('ft3'),
});

/**
 * This feature registers a single action by defining a configuration
 * object. The name of the feature must be explicit here.
 */
const ft4 = {
  name: 'ft4',
  hook: '$INIT_FEATURE',
  handler: () => console.log('ft4'),
};

/**
 * This feature returns a single action defined in the array form
 */
const ft5 = () => ['$INIT_FEATURE', () => console.log('ft5')];

/**
 * This feature registers a single action in the array form
 */
const ft6 = ['$INIT_FEATURE', () => console.log('ft6'), 'ft6'];

const ft7 = ({ registerAction }) => {
  registerAction('$INIT_FEATURE', () => console.log('ft7a'), 'ft7a');
  registerAction('$INIT_FEATURE', () => console.log('ft7b'), { name: 'ft7b' });
};

forrestjs({
  trace: 'compact',
  features: [ft1, ft2, ft3, ft4, ft5, ft6, ft7],
}).catch((err) => console.error(err));
