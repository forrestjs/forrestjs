import { UsersMenuItems } from './UsersMenuItems';
import { UsersContent } from './UsersContent';
import { UsersDashboard } from './UsersDashboard';

export const users = ({ registerAction }) => {
  registerAction({
    hook: '$LAYOUT_DRAWER_PRIMARY_LIST_ITEMS',
    handler: () => UsersMenuItems,
  });

  registerAction({
    hook: '$LAYOUT_ROUTE',
    handler: () => ({
      path: '/users',
      component: UsersContent,
    }),
  });

  registerAction({
    hook: '$DASHBOARD_ITEM',
    handler: () => ({
      lg: 4,
      md: 6,
      component: UsersDashboard,
    }),
  });
};
