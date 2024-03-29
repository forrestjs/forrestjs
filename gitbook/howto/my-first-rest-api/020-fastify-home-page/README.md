<h1 class="tutorial-step"><span>My First REST API &raquo;</span> Create a Simple Home Page</h1>

[My First REST API](../README.md) &raquo; [Create a Simple Home Page](./README.md)

---

# Create a Simple Home Page

Create a new `home-page.js` file and use the following code to scaffold a simple feature that hooks into _Fastify's Service API_ to implement a Home Page route:

```js
// This will kick in when a user requests the "/" url:
const fastifyRouteHandler = (request, reply) => {
  reply.type('text/html').send(`
        <h2>Home Page</h2>
        <p>Welcome to yet a new amazing website!</p>
      `);
};

// Export our logic as a ForrestJS Feature that integrates
// with the Fastify Service:
module.exports = {
  name: 'homePage',
  target: '$FASTIFY_ROUTE',
  handler: {
    method: 'GET',
    url: '/',
    handler: fastifyRouteHandler,
  },
};
```

> 👉 **NOTE:** `$FASTIFY_ROUTE` receives one or many [full routes declarations](https://www.fastify.io/docs/latest/Reference/Routes/#full-declaration) as documented in the Fastify documentation project.

Once you've created the feature, simply add it to your App's manifest:

```js
forrest.run({
  ...
  features: [
    require('./home-page')
  ]
})
```

Try now to reload your App's home page at http://localhost:8080.  
Your shiny static HTML content should definitely show up!

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/create-a-simple-home-page-l6pec?file=/src/index.js

---

## Feature's Folder Structure

Until now, we used a single Javascript module to host our entire Feature.

This approach may work for some simple Features, but **it will definitely go out of control** in case you are working on a more sophisticated piece of logic.
After all, you want to keep your modules as small as possible to facilitate reading throught them, right?

Let's then separate our Home Page logic into smaller pieces, that implement different responsibilities.

### The Route Handler

The route handler is the piece of logic that is supposed to handle the user's requests and provide some kind of output.

> This responsibility has nothing to share with ForrestJS or the App's composition.  
> It is a truly isolated piece of logic, who's shape depends only on Fastify's APIs

With that said, we can create `/home-page/routes/home-page.js` and implement this small part:

```js
const HOME_PAGE_CONTENT = `
      <h2>Home Page</h2>
      <p>Welcome to yet a new amazing website!</p>
    `;

module.exports = (request, reply) => {
  reply.type('text/html').send(HOME_PAGE_CONTENT);
};
```

### The Feature's Manifest

With the logic well isolated, all we have left to do is to "explain" to ForrestJS how to put the pieces together.
How to link this route implementation with the Fastify service.

We do so in the Feature's manifest file: `/home-page/index.js`:

```js
const homePageRoute = require('./routes/home-page');

module.exports = {
  name: 'homePage',
  target: '$FASTIFY_ROUTE',
  handler: {
    method: 'GET',
    url: '/',
    handler: homePageRoute,
  },
};
```

The Feature's manifest file "explains" to the rest of the ForrestJS App **how to connect the dots**, so to speak.

Here you can try out a slightly refactored example, in which we also create 2 different pages and pack them within the same Feature folder:

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/025-fastify-home-page-reorganized-7dwuh?file=/src/home-page/index.js

---
