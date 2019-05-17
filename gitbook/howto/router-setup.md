# React Router - Setup

In this page you are going to instrument your universal application with the
[react-router](https://reacttraining.com/react-router/) library. It's a matter of
installing the NPM dependency, add the `history` and wrap your `Root` components:

### NPM Dependencies

    npm install --save \
        react-router \
        react-router-dom

### Client History

Edit `/src/index.js` in order to give some history capabilites to our state:

    import createHistory from 'history/createBrowserHistory'

    ...

    const history = createHistory()

    ...

    createState(initialState, history)
        .then(boot)
        ...

### Client Routing

Edit `/src/Root.js` in order to wrap your app with `react-router`:

    import { Router } from 'react-router-dom'

    ...

    const Root = ({ store, history, ...props }) => (
        <Provider store={store}>
            <Router history={history}>
                <App {...props} />
            </Router>
        </Provider>
    )

### SSR Routing

Edit `/src/index.ssr.js` and wrap your app with the static router. This is all you need 
to do in order to enable a fully working server side routing.

The `location` will be provided by Express based on `request.url`, the `context` is used
to perform redirects or to handle any post-rendering routing related communication.

    import { StaticRouter } from 'react-router-dom'

    ...

    const Root = ({ store, location, context, ...props }) => (
        <Provider store={store}>
            <StaticRouter location={location} context={context}>
                <App {...props} />
            </StaticRouter>
        </Provider>
    )
