import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { animated, useTransition } from 'react-spring'
import { useDrag } from 'react-use-gesture'

import { animations } from './constants'
import { getStyles } from './get-styles'

// Utility dimension functions
const px2vw = px => Math.round(px / window.innerWidth * 10000) / 100
const px2vh = px => Math.round(px / window.innerHeight * 10000) / 100
const onlyPositive = position => position > 0 ? position : 0

const ReactModalBody = ({
    isVisible,
    children,
    animation,
    onRequestClose,
    slideThreshold,
    velocityThreshold,
}) => {
    const [ isDragging, setIsDragging ] = useState(false)
    const [ wasVisible, setWasVisible ] = useState(isVisible)
    const [ position, setPosition ] = useState(null)

    const modalTransition = useTransition(isVisible, null, {
        from: {
            opacity: 0,
            translate: 110,
        },
        enter: {
            opacity: 1,
            translate: 0,
        },
        leave: {
            opacity: 0,
            translate: 110,
        },
        config: {
            mass: 0.1,
            tension: 400,
            friction: 30,
        },
        // Update position on active dragging
        ...(isDragging ? {
            update: {
                translate: position,
            },
            config: {
                duration: 0,
            },
        } : {}),
        // On drag end, restore the modal position to the original place
        ...(position === 0 ? { update: { translate: position } } : {}),
    })

    const bind = useDrag(({ event, first, last, delta, velocity, direction }) => {
        const position = (animation === animations.slideLeft)
            ? onlyPositive(px2vw(delta[0]))
            : onlyPositive(px2vh(delta[1]))

        const parsedDirection = (animation === animations.slideLeft)
            ? direction[0]
            : direction[1]

        // drag start
        if (first) {
            setIsDragging(true)
            setPosition(position)

        // drag end - detect closing request
        } else if (last) {
            setIsDragging(false)
            if (
                position > (slideThreshold * 100)
                || (
                    velocity > velocityThreshold
                    && position > 0.5
                    && parsedDirection >= 0
                )
            ) {
                onRequestClose()
            } else {
                setPosition(0)
            }

        // dragging
        } else {
            event.preventDefault()
            event.stopPropagation()
            setPosition(position)
        }
    }, { event: { passive: false } })

    useEffect(() => {
        if (isVisible !== wasVisible) {
            setWasVisible(isVisible)
            if (isVisible) {
                setPosition(null)
            }
        }
    }, [ isVisible, wasVisible ])

    return modalTransition.map(({ item, key, props }) => (
        <animated.div
            {...(animation === animations.fade ? {} : bind())}
            key={key}
            children={children}
            style={{
                display: item ? 'flex' : 'none',
                position: 'fixed',
                top: 0,
                left: 0,
                ...(item ? getStyles({ props, animation }) : {}),
            }}
        />
    ))
}

ReactModalBody.propTypes = {
    isVisible: PropTypes.bool,
    animation: PropTypes.oneOf(Object.values(animations)),
    onRequestHide: PropTypes.func,
    slideThreshold: PropTypes.number,
    velocityThreshold: PropTypes.number,
}

ReactModalBody.defaultProps = {
    isVisible: true,
    animation: animations.fade,
    onRequestHide: null,
    slideThreshold: 0.5,
    velocityThreshold: 0.1,
}

export default ReactModalBody
