import React from 'react'
import ReactDOM from 'react-dom'
import createHistory from 'history/createBrowserHistory'
import './index.css'
import * as serviceWorker from './serviceWorker'
import { createState } from './state'

const boot = props => {
    const renderApp = () => {
        const Root = require('./Root').default
        ReactDOM.render(<Root {...props} />, document.querySelector('#root'))
    }

    if (module.hot) {
        module.hot.accept(renderApp)
    }

    renderApp()
}

const initialState = window.__REDUX_INITIAL_STATE__ || {
    app: { name: 'My Custom App Name' },
}

const history = createHistory()

createState(initialState, history)
    .then(boot)

    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: http://bit.ly/CRA-PWA
    // serviceWorker.unregister();
    .then(() => serviceWorker.unregister())

    .catch(err => console.log(err))
