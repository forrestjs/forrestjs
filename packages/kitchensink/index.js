const {
  runHookApp
} = require('@forrestjs/hooks');

runHookApp({
  trace: 'compact',
  services: [],
  features: []
}).catch(err => console.error(err));