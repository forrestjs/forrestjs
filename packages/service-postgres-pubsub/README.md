# @forrestjs/service-postgres-pubsub

This service leverages a _Postgres_ database to implement a pub/sub mechanism
that can scale across multiple instances of a web service.

It implements [node-pg-pubsub](https://github.com/voxpelli/node-pg-pubsub) that
is a library that works just fine.

## Usage

```js
import { addChannel, publish, once } from '@forrestjs/service-postgres-pubsub'

// create a persistent channel, the return value is a function that
// you can call to cleanup the subscription
const removeChannel = addChannel('channelName', msh => {
    console.log('channel was called with', msh)
});

// you do not need to cleanup this, it's going to be fired just once
once('channelName', () => { ... })

publish('channelName', { some: 'data' })
// -> expect the console log here
```

All the methods above take a 3rd argument called `connectionName` that allows to target
a specific _Postgres_ instance in case your app is connected to multiple ones.

## Configuration

You can provide multiple _Postgres_ connections, they should be identified by
a `connectionName` property. If omitted it's going to be `default`.

```js
registerAction({
    hook: SETTINGS,
    name: '♦ boot',
    handler: async ({ settings }) => {
        settings.postgresPubsub = [{
            connectionName: 'default',
            host: config.get('PG_HOST'),
            port: config.get('PG_PORT'),
            database: config.get('PG_DATABASE'),
            username: config.get('PG_USERNAME'),
            password: config.get('PG_PASSWORD'),
        }]
    }
})
```
