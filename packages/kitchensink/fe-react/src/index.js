import forrestjs from '@forrestjs/core';

// Services
import { reactRoot } from './services/react-root';
import { reactMUI } from './services/react-mui';
import { reactRouter } from './services/react-router';
import { reactLang } from './services/react-lang';

// Features
import { muiTheme } from './features/mui-theme';
import { layout } from './features/layout';
import { dashboard } from './features/dashboard';
import { users } from './features/users';
import { invoices } from './features/invoices';

forrestjs({
  trace: 'compact',
  services: [reactRoot, reactMUI, reactLang, reactRouter],
  features: [muiTheme, layout, dashboard, users, invoices],
}).catch((err) => console.error(`Boot: ${err.message}`));
