import React from 'react'
import { Provider } from 'react-redux'
import App from './App'

const Root = ({ store, ...props }) => (
    <Provider store={store}>
        <App {...props} />
    </Provider>
)

export default Root
