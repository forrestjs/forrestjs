import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import logo from './logo.svg'
import './App.css'
import AppName from './AppName'
import { Users, UserPage } from './features/users'
import { Splash } from './features/splash'

const App = () => (
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
                href="https://marcopeg.com"
                target="_blank"
                rel="noopener noreferrer"
            >
                marcopeg.com
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

export default App
