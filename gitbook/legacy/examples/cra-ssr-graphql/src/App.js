/* eslint react/prefer-stateless-function:off */

import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { Switch, Route } from 'react-router-dom'
import logo from './logo.svg'
import AppName from './AppName'
import { Splash } from './features/splash'
import { Users, UserPage } from './features/users'
import './App.css'

class App extends Component {
    render () {
        return (
            <div className="App">
                <Helmet>
                    <html lang="en" />
                    <title>@marcopeg/react-ssr</title>
                </Helmet>
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                     Edit <code>src/App.js</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header>
                <AppName />
                <Switch>
                    <Route exact path="/" component={Users} />
                    <Route path="/user/:id" component={UserPage} />
                </Switch>
                <Splash />
            </div>
        )
    }
}

export default App
