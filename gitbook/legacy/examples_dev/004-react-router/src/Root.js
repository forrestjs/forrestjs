import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import App from './App'

const Root = ({ store, history, ...props }) => (
    <Provider store={store}>
        <Router history={history}>
            <App {...props} />
        </Router>
    </Provider>
)

export default Root
