import ReactDOM from 'react-dom'
import React from 'react'
import PropTypes from 'prop-types'

import ReactModalBackdrop from './ReactModalBackdrop'
import ReactModalBody from './ReactModalBody'
import { animations } from './constants'

const ReactModal = ({ target, id, children, ...props }) =>
    ReactDOM.createPortal([
        <ReactModalBackdrop {...props} key={`${id}_backdrop`} />,
        <ReactModalBody {...props} key={`${id}_body`} children={children} />,
    ], target)

ReactModal.propTypes = {
    id: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    target: PropTypes.any, // eslint-disable-line
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.element,
    ]).isRequired,
}

ReactModal.defaultProps = {
    id: `Modal_${Date.now()}_${Math.round(Math.random() * 1000000)}`,
    target: document.body,
}

ReactModal.animations = animations

export default ReactModal
