# @forrestjs/service-posrgres

ForrestJS service which helps connecting to a Postgres server.

    const services = [
        require('@forrestjs/service-postgres'),
    ]

    registerAction({
        hook: SETTINGS,
        name: '♦ boot',
        handler: ({ settings }) => {
            settings.postgres = [
                {
                    connectionName: 'default',
                    host: config.get('PG_HOST'),
                    port: config.get('PG_PORT'),
                    database: config.get('PG_DATABASE'),
                    username: config.get('PG_USERNAME'),
                    password: config.get('PG_PASSWORD'),
                    maxAttempts: Number(config.get('PG_MAX_CONN_ATTEMPTS', 25)),
                    attemptDelay: Number(config.get('PG_CONN_ATTEMPTS_DELAY', 5000)),
                    models: [],
                },
            ]
            ...
