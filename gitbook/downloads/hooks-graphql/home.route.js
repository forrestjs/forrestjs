const { EXPRESS_ROUTE } = require('@forrestjs/service-express')

const routeHome = ({ app }) =>
    app.get('/', (_, res) => res.send('Welcome!'))

module.exports = [ EXPRESS_ROUTE, routeHome ]
