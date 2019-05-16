/**
 * Locale Service
 * ============================
 *
 * - loads and caches languages definitions
 * - provides `react-intl` context to the app
 *   and switches language automatically
 *
 * NOTE: you must provide the list of locales that your app intend to use
 * before you render the app itself:
 * https://github.com/yahoo/react-intl/wiki#loading-locale-data
 *
 */

export const reducers = {
    locale: require('./locale.reducer').default,
}
export const services = [
    require('./locale.service'),
]
export const listeners = []

// application wrapper that provided `intl` context
export { default as LocaleProvider } from './LocaleProvider'
export { default as SetLocaleLink } from './SetLocaleLink'

// dispatch(loadLocale('it'))
export { loadLocale } from './locale.service'
