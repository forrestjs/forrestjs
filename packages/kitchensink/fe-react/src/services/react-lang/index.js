import * as hooks from './hooks';

export const reactLang = ({ registerHook, registerAction }) => {
  registerHook(hooks);
  registerAction({
    hook: '$REACT_ROOT_WRAPPER',
    handler: (App) => {
      console.log('Add lang');
      return App;
    },
  });
};
