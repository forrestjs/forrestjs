# API - createSSRRender

Use this method to create the SSR rendering function:

    import React from 'react'
    import { Provider } from 'react-redux'
    import { createSSRRender } from '@marcopeg/react-ssr/lib/create-ssr-render'
    import { StaticRouter } from 'react-router-dom'
    import { createState } from './state'
    import App from './App'

    const Root = ({ store, location, context, ...props }) => (
        <Provider store={store}>
            <StaticRouter location={location} context={context}>
                <App {...props} />
            </StaticRouter>
        </Provider>
    )

    export const staticRender = createSSRRender(Root, { createState })

This is where most of the heavy lifting happens. The bottomline is that you provide
a _Root component_ that is supposed to render your app in the server.

For very simple apps that might be the very same root as for the frontend. Tipically
the things begin to change when you bring in `react-router` and need to provide
a `StaticRouter` in for ssr.
