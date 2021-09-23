import React from 'react'
import { Provider } from 'react-redux'
import { createSSRRender } from '@marcopeg/react-ssr/lib/create-ssr-render'
import { createState } from './state'
import App from './App'

const Root = ({ store, ...props }) => (
    <Provider store={store}>
        <App {...props} />
    </Provider>
)    

export const staticRender = createSSRRender(Root, { createState })
