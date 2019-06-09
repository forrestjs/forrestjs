const { runHookApp } = require('@forrestjs/hooks')
const { registerAction, SETTINGS } = require('@forrestjs/hooks')

registerAction([SETTINGS, ({ settings }) => {
    settings.express = {
        graphql: {
            // mountPoint: '/graphql',
        },
    }
}])

runHookApp([
    require('@forrestjs/service-express'),
    require('./home.route'),
    require('@forrestjs/service-express-graphql'),
    require('./welcome.query'),
])
