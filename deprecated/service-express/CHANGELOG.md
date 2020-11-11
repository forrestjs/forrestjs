# Change Log

## v3.14.0

The `EXPRESS_ROUTE` accepts a simple package as returning value, 
this upgrade also provides more hooks:

- `EXPRESS_GET`
- `EXPRESS_POST`
- `EXPRESS_PUT`
- `EXPRESS_DELETE`

```js
const { runHookApp } = require('@forrestjs/hooks')
const serviceExpress = require('@forrestjs/service-express')

runHookApp({
  trace: 'compact',
  services: [serviceExpress],
  features: [
    [
      '$EXPRESS_GET',
      ['/', (req, res) => res.send('home')],
      'featureHome'
    ],
    [
      '$EXPRESS_ROUTE', {
        method: 'GET',
        url: '/foo',
        handler: (req, res) => res.send('foo')
      },
      'featureFoo'
    ]
  ]
})
```

