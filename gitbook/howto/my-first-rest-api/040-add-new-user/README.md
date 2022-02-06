<h1 class="tutorial-step"><span>My First REST API &raquo;</span> Add a New User</h1>

[My First REST API](../README.md) &raquo; [Add a New User](./README.md)

---

# Add a New User

Let's look at another small evolution of our REST API. Now it's time to get some real data from the user and modify our small database.

### Setup Route & Schema

I usually start by scaffolding the route's handler. I don't implement any logic, but I strongly suggest you to implement the [route's schema definition](https://ruanmartinelli.com/posts/using-schemas-fastify-fun-and-profit) so to add some safety to your internal logic.

Start with `/users/routes/add-user.js`:

```js
const handler = (request, reply) => {
  // Logic will go here
  reply.send('ok');
};

const schema = {
  query: {
    type: 'object',
    properties: {
      name: { type: 'string' },
    },
    additionalProperties: false,
    required: ['name'],
  },
};

module.exports = { handler, schema };
```

Then in `/users/index.js` we can simply add a new route's definition to the list that we have already prepared:

```js
{
  method: "GET",
  url: "/users/add",
  schema: addUser.schema,
  handler: addUser.handler
}
```

Check it out here:  
https://codesandbox.io/s/040-add-a-new-user-g0h0h?file=/src/users/index.js:532-775

### Modify the App's Context

The implementation of our handler is still very simplicistic, but again we use the [`getContext()`](../../../api/get-context/README.md) API to take a reference to the User's DB we store in the App's context and modify it:

```js
const handler = (request, reply) => {
  // Use the getContext() API to access the App's Context memory:
  const users = request.getContext('users.list');
  users.push(request.query.name);

  reply.send(users);
};
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/040-add-a-new-user-g0h0h

---
