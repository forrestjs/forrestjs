import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const mapSate = ({ network }) => ({
    isOnline: network.isOnline,
})

const Online = ({ isOnline, render, component, children }) => {
    if (render) {
        return React.createElement(render, { isOnline })
    }

    if (component) {
        return isOnline
            ? React.createElement(component)
            : null
    }

    return isOnline
        ? children
        : null
}

Online.propTypes = {
    isOnline: PropTypes.bool.isRequired,
    render: PropTypes.func,
    component: PropTypes.func,
    children: PropTypes.any, // eslint-disable-line
}

Online.defaultProps = {
    render: null,
    component: null,
}

export default connect(mapSate)(Online)
