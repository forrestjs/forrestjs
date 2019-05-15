export default `
query locale (
    $locale: String!
) {
    locale (locale: $locale) {
        locale
        messages
    }
}`
