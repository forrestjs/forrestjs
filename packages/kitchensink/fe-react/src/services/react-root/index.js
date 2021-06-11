import React from 'react';
import ReactDOM from 'react-dom';
import * as hooks from './hooks';
import reportWebVitals from './reportWebVitals';
import { defaultComponent } from './default-component';
import { GetContext } from './use-get-context';
import { GetConfig } from './use-get-config';
export { useGetContext } from './use-get-context';
export { useGetConfig } from './use-get-config';

export const reactRoot = ({
  registerAction,
  createHook,
  getConfig,
  getContext,
  setContext,
  registerHook,
}) => {
  registerHook(hooks);

  registerAction({
    hook: '$INIT_SERVICE',
    handler: () => {
      const { value: rootEl } = createHook.waterfall(
        hooks.REACT_ROOT_COMPONENT,
        getConfig('reactRoot.component', defaultComponent),
      );

      const { value: reactRoot } = createHook.waterfall(
        hooks.REACT_ROOT_WRAPPER,
        <GetConfig.Provider value={getConfig}>
          <GetContext.Provider value={getContext}>{rootEl}</GetContext.Provider>
        </GetConfig.Provider>,
      );

      setContext('reactRoot.component', reactRoot);
    },
  });

  registerAction({
    hook: '$START_SERVICE',
    handler: () => {
      const rootId = getConfig('reactRoot.target', 'root');
      const reactRoot = getContext('reactRoot.component');
      ReactDOM.render(reactRoot, document.getElementById(rootId));

      // If you want to start measuring performance in your app, pass a function
      // to log results (for example: reportWebVitals(console.log))
      // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
      if (getConfig('reactRoot.webvitals.isActive', false)) {
        reportWebVitals();
      }
    },
  });
};
