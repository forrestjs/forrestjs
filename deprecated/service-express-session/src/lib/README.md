# service-express-session

Inject an Express middleware that provides means to handle a session as a JWT that
is stored ad a Cookie or can be exchanged as a header.

## Usage

```js
await req.session.start()
await req.session.destroy()
await req.session.set({ foo: 123, name: 'Marco' })
await req.session.get('id')
await req.session.unset([ 'foo', 'name' ])
```

#### get/set

Those methods allow yo

## Configuration

#### express.session.autoStart

default: `true`

If there is no running session, a new session will be generated on the fly and the
`req` object decorated accordingly.

#### express.session.autoExtend

default: `true`

If true, the session expiry time will be refreshed and a new JWT released either via
Cookie or response header.

#### express.session.duration

default: `20m`

Default duration of an inactive session (or if `autoExtend === false`).

#### express.session.attributeName

default: `session`

Property name that is used to decorate `req` and `res`.

#### express.session.setHeader

default: `false`

#### express.session.headerName

default: `X-session-Id`

#### express.session.useCookies

default: `true`

#### express.session.cookieName

default: `session-id`

#### express.session.useClientCookie

default: `false`

If set to `true` a client accessible cookie will be used. This option is actually
discouraged for security reasons as it makes it vulnerable to a session spoofing attack.

#### express.session.uuidVersion

default: `v4`

