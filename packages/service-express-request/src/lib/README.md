# service-express-request

Assigns a `uuid` to each request and make id available to:
- `req.id`
- `X-Request-Id` header
- GraphQL `{ request { id } }` (optional)

This service uses [express-request-id](https://www.npmjs.com/package/express-request-id)
under the hood and can be configured as described in that documentation page:

```js
setConfig('express.request.attributeName', 'foo')
setConfig('express.request.headerName', 'X-FOO')
```
