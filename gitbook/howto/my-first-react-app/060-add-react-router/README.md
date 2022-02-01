<h1 class="tutorial-step"><span>My First React App &raquo;</span> Add React Router</h1>

[My First React App](../README.md) &raquo; [Add React Router](./README.md)

---

# Add React Router

One of the most common things to do with React is adding [react-router](https://reactrouter.com/) to handle the url as part of an App state. It's a very handy library.

ForrestJS makes things dramatically easy for you:

```js
// Import the service
import reactRouter from '@forrestjs/react-router';

// Just add it to the services list
runHookApp({
  services: [reactRoot, reactRouter],
});
```

[![Edit 050-customize-material-ui](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/060-add-react-router-4lxe6?file=/src/index.js:244-374)

This is enough to have your entire App ready to implement the `Route` component. For the rest of this tutorial we are going to create a simple Feature that implements the routes.

## The `InternalPage` Component

The first component is the `Page` that will target a navigation command and uses information from the url's state to show customized information.

Open your editor to `/src/routes/Page.js`:

```js
import { Link, useParams } from 'react-router-dom';

export const InternalPage = () => {
  const { pageId } = useParams();
  return (
    <div>
      <h4>Page {pageId}</h4>
      <Link to="/">Go home</Link>
    </div>
  );
};
```

[![Edit 050-customize-material-ui](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/060-add-react-router-4lxe6?file=/src/routes/InternalPage.js)

> 👉 This is a pure React component, no ForrestJS stuff is needed here!

## The `HomePage` Component

Then we move to the `src/routes/HomePage.js` component where we implement our routes:

```jsx
import { Link } from 'react-router-dom';

export const HomePage = () => (
  <ul>
    <li>
      <Link to="/page/1">Go to Page1</Link>
    </li>
    <li>
      <Link to="/page/2">Go to Page2</Link>
    </li>
  </ul>
);
```

[![Edit 050-customize-material-ui](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/060-add-react-router-4lxe6?file=/src/routes/HomePage.js)

> 👉 This is a pure React component, no ForrestJS stuff is needed here!

## The `Routes` Component

The `src/routes/AppRoutes.js` component represents the glue between hour HomePage and InternalPage views:

```jsx
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './HomePage';
import { InternalPage } from './InternalPage';

export const AppRoutes = () => (
  <Routes>
    <Route path="/" exact element={<HomePage />} />
    <Route path="/page/:pageId" element={<InternalPage />} />
  </Routes>
);
```

[![Edit 050-customize-material-ui](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/060-add-react-router-4lxe6?file=/src/routes/Routes.js)

> 👉 Also here, only pure React code was used 😎.

## The Feature's Manifest

Finally, it's time to wrap stuff up and implement the `$REACT_ROOT_COMPONENT` component in our Feature's manifest.

But this is nothing new to you. You did before, right?

`src/routes/index.js`

```js
import { AppRoutes } from './AppRoutes';

export const routes = ({ registerAction }) => {
  registerAction({
    hook: '$REACT_ROOT_COMPONENT',
    handler: { component: AppRoutes },
  });
};
```

[![Edit 050-customize-material-ui](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/060-add-react-router-4lxe6?file=/src/routes/index.js)
