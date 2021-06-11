import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { useGetContext, useGetConfig } from '../../services/react-root';
import { LayoutDrawer } from './LayoutDrawer';
import { LayoutAppBar } from './LayoutAppBar';
import { LayoutRoutes } from './LayoutRoutes';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
}));

export const Layout = () => {
  const classes = useStyles();
  const title = useGetContext('layout.title');
  const content = useGetContext('layout.content', []);
  const routes = useGetContext('layout.routes', []);
  const primaryListItems = useGetContext('layout.drawer.list.primary.items');
  const secondaryListItems = useGetContext(
    'layout.drawer.list.secondary.items',
  );

  // Compute drawer's stateful information:
  const hasDrawer = primaryListItems.length + secondaryListItems.length > 0;
  const initialOpenState = useGetConfig('layout.drawer.isOpen', false);
  const [open, setOpen] = React.useState(initialOpenState);
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <LayoutAppBar
        hasDrawer={hasDrawer}
        isDrawerOpen={hasDrawer && open}
        handleDrawerOpen={handleDrawerOpen}
        title={title}
      />
      {hasDrawer && (
        <LayoutDrawer
          isOpen={open}
          handleClose={handleDrawerClose}
          primaryItems={primaryListItems}
          secondaryItems={secondaryListItems}
        />
      )}
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <LayoutRoutes items={routes} />
        {content.map((ContentItem, idx) => (
          <ContentItem key={ContentItem.name} />
        ))}
      </main>
    </div>
  );
};
