import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import AppName from './AppName'
import { Users } from './features/users'
import { Splash } from './features/splash'

class App extends Component {
    render() {
        return (
            <div className="App">
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
                <Users />
                <Splash />
            </div>
        );
    }
}

export default App;
