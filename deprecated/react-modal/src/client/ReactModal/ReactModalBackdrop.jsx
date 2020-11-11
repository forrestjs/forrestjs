import React from 'react'
import PropTypes from 'prop-types'
import { animated, useTransition } from 'react-spring'

import { animations } from './constants'
import { getStyles } from './get-styles'

const ReactModalBackdrop = ({
    isVisible,
    hideOnClick,
    onRequestClose,
    backdropMinOpacity,
    backdropMaxOpacity,
    backdropColor,
    backdropChildren,
}) => {
    const transition = useTransition(isVisible, null, {
        from: {
            opacity: backdropMinOpacity,
        },
        enter: {
            opacity: backdropMaxOpacity,
        },
        leave: {
            opacity: backdropMinOpacity,
        },
        config: {
            mass: 0.1,
            tension: 400,
            friction: 30,
        },
    })

    const handleClick = () => {
        if (onRequestClose && hideOnClick) {
            onRequestClose()
        }
    }

    return transition.map(({ item, key, props }) => (
        <animated.div
            key={key}
            children={backdropChildren}
            onClick={handleClick}
            style={{
                display: item ? 'flex' : 'none',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: backdropColor,
                ...(item ? getStyles({ props, animation: animations.fade }) : {}),
            }}
        />
    ))
}

ReactModalBackdrop.propTypes = {
    isVisible: PropTypes.bool,
    hideOnClick: PropTypes.bool,
    onRequestClose: PropTypes.func,
    backdropColor: PropTypes.string,
    backdropMinOpacity: PropTypes.number,
    backdropMaxOpacity: PropTypes.number,
    backdropChildren: PropTypes.element,
}

ReactModalBackdrop.defaultProps = {
    isVisible: true,
    hideOnClick: true,
    onRequestClose: null,
    backdropColor: '#333',
    backdropMinOpacity: 0,
    backdropMaxOpacity: 0.8,
    backdropChildren: null,
}

export default ReactModalBackdrop
