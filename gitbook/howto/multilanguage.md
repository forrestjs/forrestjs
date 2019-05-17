# Add Multilanguage Support

Writing apps in plain English is cool, but to reach out more customers you likely
want to translate your app in many languages.

[react-intl](https://www.npmjs.com/package/react-intl) helps you with this goal.

    npm install --save react-intl

## 2 - create src/locale.js

    import { addLocaleData } from 'react-intl'

    import en from 'react-intl/locale-data/en'
    import it from 'react-intl/locale-data/it'

    addLocaleData([ ...en, ...it ])

and link it into `src/index.js` and `src/index.ssr.js`

    import './locale'

## 3 - add the "feature/locale" and link it

## 4 - add the server support



