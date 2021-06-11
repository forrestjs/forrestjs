import { Switch, Route } from 'react-router-dom';

export const LayoutRoutes = ({ items }) => {
  if (!items.length) {
    return (
      <div
        style={{
          margin: '10px 23px',
        }}
      >
        No routes configured.
        <br />
        Please hook into{' '}
        <em>
          <code>LAYOUT_ROUTE</code>
        </em>
        .
      </div>
    );
  }

  return (
    <Switch>
      {items.map((routeConfig, idx) => (
        <Route key={idx} {...routeConfig} />
      ))}
    </Switch>
  );
};
