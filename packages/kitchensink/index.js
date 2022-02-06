const { runHookApp } = require('@forrestjs/hooks');

forrestjs({
  trace: 'compact',
  services: [],
  features: [],
}).catch((err) => console.error(err));
