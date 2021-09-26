<h1 class="tutorial-step"><span>My First REST API &raquo;</span> Create a Simple Home Page</h1>

[My First Feature](../README.md) &raquo; [Create a Simple Home Page](./README.md)

---

# Create a Simple Home Page

Create a new `home-page.js` file and use the following code to scaffold a simple feature that hooks into _Fastify's Service API_ to implement a Home Page route:

```js
const HOME_PAGE_CONTENT = `
  <h2>Home Page</h2>
  <p>Welcome to yet a new amazing website!</p>
`;

const fastifyRouteHandler = (request, reply) => {
  reply.type("text/html").send(HOME_PAGE_CONTENT);
};

const homePageFeatureManifest = ({ registerAction }) => {
  registerAction({
    hook: "$FASTIFY_GET",
    handler: {
      url: "/",
      handler: fastifyRouteHandler
    }
  });
};

module.exports = homePageFeatureManifest;
```

Once you've created the feature, simply add it to your App's manifest:

```js
runHookApp({
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

For now, we used a single Javascript module to host our entire feature. That approach may work for some simple features, but it will definitely go out of control in case you are working on a more sophisticated piece of logic.

https://codesandbox.io/s/025-fastify-home-page-reorganized-7dwuh?file=/src/index.js
