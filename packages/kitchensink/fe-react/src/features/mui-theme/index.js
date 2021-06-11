import { blueGrey } from '@material-ui/core/colors';

export const muiTheme = ({ registerAction }) => {
  registerAction({
    hook: '$MUI_THEME',
    handler: (theme) => ({
      ...theme,
      palette: {
        primary: blueGrey,
      },
    }),
  });
};
