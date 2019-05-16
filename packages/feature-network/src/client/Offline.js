import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const mapSate = ({ network }) => ({
    isOffline: !network.isOnline,
})

const Offline = ({ isOffline, render, component, children }) => {
    if (render) {
        return React.createElement(render, { isOffline })
    }

    if (component) {
        return isOffline
            ? React.createElement(component)
            : null
    }

    return isOffline
        ? children
        : null
}

Offline.propTypes = {
    isOffline: PropTypes.bool.isRequired,
    render: PropTypes.func,
    component: PropTypes.func,
    children: PropTypes.any, // eslint-disable-line
}

Offline.defaultProps = {
    render: null,
    component: null,
}

export default connect(mapSate)(Offline)
