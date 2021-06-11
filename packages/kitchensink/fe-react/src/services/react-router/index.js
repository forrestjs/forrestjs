import { BrowserRouter } from 'react-router-dom';
import * as hooks from './hooks';

export const reactRouter = ({
  registerHook,
  registerAction,
  createHook,
  getConfig,
}) => {
  registerHook(hooks);

  registerAction({
    hook: '$REACT_ROOT_WRAPPER',
    handler: (App) => {
      // Let customize the Router wrapper
      const { value: Router } = createHook.waterfall(
        hooks.REACT_ROUTER_COMPONENT,
        getConfig('reactRouter.component', BrowserRouter),
      );

      return <Router children={App} />;
    },
  });
};
