import React from 'react'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router-dom'
import { createSSRRender } from '@marcopeg/react-ssr/lib/create-ssr-render'
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
