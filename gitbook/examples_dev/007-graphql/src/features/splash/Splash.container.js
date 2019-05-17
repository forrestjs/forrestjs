import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import SplashUI from './Splash.component'

// check on the "splash" availability, this might happen in case you
// place the <Splash /> ui component, but disable the feature.
const mapState = state => state.splash
    ? state.splash
    : { isVisible: false }

class Splash extends React.Component {
    constructor (props) {
        super(props)

        try {
            this.target = document.createElement('div')
            document.body.appendChild(this.target)
        } catch (err) {} // eslint-disable-line
    }

    render () {
        return this.target
            ? ReactDOM.createPortal(<SplashUI {...this.props} />, this.target)
            : null
    }
}

export default connect(mapState)(Splash)
