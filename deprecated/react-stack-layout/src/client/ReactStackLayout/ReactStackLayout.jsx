import ReactDOM from 'react-dom'
import React, { useState, useEffect } from 'react'
import { animated, useTransition } from 'react-spring'
import { useDrag } from 'react-use-gesture'

const px2vw = px => Math.round(px / window.innerWidth * 10000) / 100
const onlyPositive = position => position > 0 ? position : 0

const StackLayout = ({
    items,
    onRequestClose,
    onRequestPush,
    slideThreshold,
    velocityThreshold,
}) => {
    const [ isDragging, setIsDragging ] = useState(false)
    const [ position, setPosition ] = useState(0)
    const [ itemsCount, setItemsCount ] = useState(items.length)

    useEffect(() => {
        if (items.length !== itemsCount) {
            setItemsCount(items.length)
            setPosition(0)
        }
    }, [ items.length, itemsCount ])

    const bind = useDrag(({ event, first, last, delta, velocity, direction }) => {
        const position = onlyPositive(px2vw(delta[0]))

        // drag start
        if (first) {
            setIsDragging(true)
            setPosition(position)

        // drag end
        } else if (last) {
            setIsDragging(false)
            if (
                position > (slideThreshold * 100)
                || (velocity > velocityThreshold && position > 0.5 && direction[0] >= 0)
            ) {
                onRequestClose(items[items.length - 1], items.length)
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

    const transitions = useTransition(items, item => item.key, {
        from: {
            opacity: 0.7,
            translate: 110,
        },
        enter: {
            opacity: 1,
            translate: 0,
        },
        leave: {
            opacity: 0.7,
            translate: 110,
        },
        update: (item) => {
            const idx = items.indexOf(item)
            const tot = items.length - 1

            // last item
            if (idx === tot) {
                return {
                    opacity: 1,
                    translate: position,
                }

            // one to last item
            } else if (idx === tot - 1) {
                const move = -90 + position
                return {
                    opacity: move * 2 / 100,
                    translate: move < 0 ? move * 0.7 : 0,
                }

            // all the others
            } else {
                return {
                    opacity: 0.4,
                    translate: -90,
                }
            }
        },
        config: {
            mass: 0.1,
            tension: 400,
            friction: 30,
            ...(isDragging ? { duration: 0 } : {}),
        },
    })

    const stack = transitions.map(({ item, props, key }, i) => {
        let animatedProps = {
            key,
            style: {
                position: 'fixed',
                top: 0,
                left: 0,
                display: 'flex',
                transform: props.translate.interpolate(v => `translate3d(${v}vw, 0, 0)`),
                // opacity: props.opacity,
            },
        }

        // apply drag binding only to the last item
        if (i >= items.length - 1) {
            animatedProps = {
                ...bind(),
                ...animatedProps,
            }
        }

        return (
            <animated.div {...animatedProps}>
                {React.createElement(item.render, {
                    requestClose: () => onRequestClose(item, i),
                    requestPush: onRequestPush,
                })}
            </animated.div>
        )
    })

    return ReactDOM.createPortal(stack, document.body)
}

StackLayout.defaultProps = {
    slideThreshold: 0.5,
    velocityThreshold: 0.1,
}

export default StackLayout
