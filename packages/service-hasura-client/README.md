# Hasura Client for NodeJS

## Configuration

```js
forrest.run({
  settings: {
    hasura: {
      endpoint: 'http://localhost:8080',
      secret: 'hasura',
      auth: {
        token: 'token',
        jwt: {
          secret: 'abc',
          roles: ['r1', 'r2'],
          defaultRole: ['r1'],
          session: {
            foo: 'bar'
          }
        },
        fn: async () => ({
          token: 'token',
          ttl: 0
        })
      } 
    }
  }
})
```

> 👉 Only **one** auth setting is supported at any time.

### Authorization Token

When you provide this setting, HasuraClient will use it as `Authorization: Bearer {token}`.

### Authorization JWT

[[ TO BE IMPLEMENTED ]]

When you provide this setting, HasuraClient will calculate the JWT and use it as `Authorization: Bearer {jwt}`.

### Authorization Logic

[[ TO BE IMPLEMENTED ]]

When you provide this setting you can calculate the authorization token by offering a custom logic.

- the resulting `token` key will be used as `Authorization: Bearer {token}`.
- the `ttl` will be used as cache flag:
  - `0` keep forever (until reboot)
  - `-1` calculate at every query
  - `1000` keep for 1s (integer value expressed in _milliseconds_)

## Query

```js
const MY_QUERY = `
  query FooBar ($var: String!) {
    resource (
      par: $var
    ) {
      field1
      field2
    }
  }
`;

const myFeature = () => [{
  target: '$START_FEATURE',
  handler: async ({ getContext }) => {
    const hasura = getContext('hasura');
    const res = await hasura.query(MY_QUERY, {
      var: 'foobar'
    });

    console.log(res);
  }
}];
```

## Sql

```js
const myFeature = () => [{
  target: '$START_FEATURE',
  handler: async ({ getContext }) => {
    const hasura = getContext('hasura');
    const res = await hasura.sql(MY_QUERY, {
      var: 'foobar'
    });

    console.log(res);
  }
}];
```

