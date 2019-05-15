/* eslint-disable */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'

const mapState = ({ locale }) => ({
    locale: locale.locale.split('_').shift(),
    messages: locale.locales[locale.locale]
        ? locale.locales[locale.locale].messages
        : {},
})

const LocaleProvider = ({ locale, messages, children }) => (
    <IntlProvider
        locale={locale}
        messages={messages}
    >
        {typeof children === 'function' ? children(locale) : children}
    </IntlProvider>
)

LocaleProvider.propTypes = {
    locale: PropTypes.string.isRequired,
    messages: PropTypes.object.isRequired,
    children: PropTypes.any.isRequired, // eslint-disable-line
}

export default connect(mapState)(LocaleProvider)
