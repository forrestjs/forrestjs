# Fetchq Task

As configuration:

```js
forrest.run({
  settings: {
    fetchq: {
      task: {
        register: [
          {
            // Document in the tasks' queue:
            subject: "cqrs-todos",
            payload: { target: "todos" },
            // Worker for this specific task:
            handler: (doc, ctx) => {
              console.log("cqrs-todos", doc.payload);
              return doc.reschedule("+1s");
            }
          }
        ]
      }
    }
  }
})
```

As an extension:

```js
const myFeature = () => [
  {
    target: "$FETCHQ_REGISTER_TASK",
    handler: {
      // Document in the tasks' queue:
      subject: "cqrs-todos",
      payload: { target: "todos" },
      // Worker for this specific task:
      handler: (doc, ctx) => {
        console.log("cqrs-todos", doc.payload);
        return doc.reschedule("+1s");
      }
    }
  }
]
```