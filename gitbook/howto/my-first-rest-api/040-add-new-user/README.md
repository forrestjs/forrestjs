<h1 class="tutorial-step"><span>My First REST API &raquo;</span> Add a New User</h1>

[My First Feature](../README.md) &raquo; [Add a New User](./README.md)

---

# Add a New User


### Setup Route & Schema

In `/users/routes/add-user.js`:

```js
const handler = (request, reply) => {
  // Logic will go here
};

const schema = {
  query: {
    type: "object",
    properties: {
      name: { type: "string" }
    },
    additionalProperties: false,
    required: ["name"]
  }
};

module.exports = { handler, schema };
```

Then in `/users/index.js` we can configure the new route with a handler and the schema applied to it:

```js
{
  method: "GET",
  url: "/users/add",
  schema: addUser.schema,
  handler: addUser.handler
}
```

https://codesandbox.io/s/040-add-a-new-user-g0h0h?file=/src/users/index.js

### Modify the Context memory




---

**💻 Live on CodeSandbox:**   
https://codesandbox.io/s/040-add-a-new-user-g0h0h

---