const { runHookApp } = require('@forrestjs/core');

forrestjs({
  trace: 'compact',
  services: [],
  features: [],
}).catch((err) => console.error(err));
