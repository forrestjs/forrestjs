import React from 'react';

import { useGetContext } from '../../services/react-root';
import PageContent from '../../components/PageContent';
import PageItem from '../../components/PageItem';

export const DashboardContent = () => {
  const dashboardItems = useGetContext('dashboard.items', []);

  return (
    <PageContent>
      {dashboardItems.map(({ component: Component, ...props }, idx) => (
        <PageItem key={Component.name} {...props}>
          <Component />
        </PageItem>
      ))}
    </PageContent>
  );
};
