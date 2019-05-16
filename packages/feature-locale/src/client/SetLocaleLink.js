import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { loadLocale } from './locale.service'
import { Link } from 'react-router-dom'

const mapState = ({ locale }, { to }) => ({
    isActive: (locale.locale === to),
})

const mapDispatch = (dispatch) => ({
    changeLanguage: (to) => (evt) => {
        evt.preventDefault()
        evt.stopPropagation()
        dispatch(loadLocale(to))
    },
})

const SetLocaleLink = ({
    to,
    isActive,
    changeLanguage,
    children,
    style,
    activeStyle,
    className,
    activeClassName,
    ...props
}) => (
    <Link
        {...props}
        to={`?locale=${to}`}
        onClick={changeLanguage(to)}
        className={isActive ? activeClassName : className}
        style={isActive ? activeStyle : style}
    >
        {children}
    </Link>
)

SetLocaleLink.propTypes = {
    to: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    changeLanguage: PropTypes.func.isRequired,
    className: PropTypes.string,
    activeClassName: PropTypes.string,
    style: PropTypes.object,
    activeStyle: PropTypes.object,
    children: PropTypes.any.isRequired, // eslint-disable-line
}

SetLocaleLink.defaultProps = {
    className: null,
    activeClassName: null,
    style: null,
    activeStyle: null,
}

export default connect(mapState, mapDispatch)(SetLocaleLink)
