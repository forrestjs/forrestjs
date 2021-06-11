import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import * as hooks from './hooks';

export const reactMUI = ({
  registerHook,
  registerAction,
  createHook,
  getConfig,
}) => {
  registerHook(hooks);

  registerAction({
    hook: '$REACT_ROOT_WRAPPER',
    handler: (App) => {
      const themeConfig = getConfig('react-mui.theme', {});
      const themeSource = createHook.waterfall(hooks.MUI_THEME, themeConfig);
      const theme = createMuiTheme(themeSource.value);

      return <ThemeProvider theme={theme} children={App} />;
    },
  });
};
