const { runHookApp } = require('@forrestjs/hooks');

function ft1({ registerAction }) {
  registerAction({
    hook: '$INIT_FEATURE',
    handler: () => {},
  });
}

runHookApp({
  trace: 'compact',
  services: [],
  features: [ft1],
}).catch((err) => console.error(err));
