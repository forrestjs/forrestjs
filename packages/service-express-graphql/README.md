# @forrestjs/service-express-graphql

ForrestJS service which sets up a GraphQL endpoint in your ExpressJS App.

    const services = [
        require('@forrestjs/service-express'),
        require('@forrestjs/service-express-graphql'),
    ]

    registerAction({
        hook: SETTINGS,
        name: '♦ boot',
        handler: async ({ settings }) => {
            settings.express = {
                graphql: {
                    testIsEnabled: true,
                    testToken: 'fooo',
                },
                ...
            }


