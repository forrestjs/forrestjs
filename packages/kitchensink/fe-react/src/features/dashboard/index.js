import * as hooks from './hooks';
import { DashboardMenuItems } from './DashboardMenuItems';
import { DashboardContent } from './DashboardContent';

export const dashboard = ({
  registerHook,
  registerAction,
  createHook,
  setContext,
}) => {
  registerHook(hooks);

  registerAction({
    hook: '$LAYOUT_DRAWER_PRIMARY_LIST_ITEMS',
    handler: () => DashboardMenuItems,
  });

  registerAction({
    hook: '$LAYOUT_ROUTE',
    handler: () => ({
      exact: true,
      path: '/',
      component: DashboardContent,
    }),
  });

  registerAction({
    hook: '$LAYOUT_TITLE',
    handler: () => 'Dashboard',
  });

  registerAction({
    hook: '$INIT_SERVICE',
    handler: () => {
      const dashboardItems = createHook
        .sync(hooks.DASHBOARD_ITEM)
        .map((_) => _[0]);

      setContext('dashboard.items', dashboardItems);
    },
  });
};
