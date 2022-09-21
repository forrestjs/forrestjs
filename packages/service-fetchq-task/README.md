# Fetchq Task

Let you add singleton tasks to a Fetchq queue. 

> 👉 _Each task gets executed by one single worker at the time, no matter the horizontal scalability of the queue._
>
> You keep scaling the associated workers as so to run different tasks in parallel.

This is suitable for running stuff akin to a _CRON Job_.

## Configuration

```js
forrest.run({
  settings: {
    fetchq: {
      task: {
        // Register tasks at config time:
        // (see "Add Tasks" paragraph for details)
        register: [
          {
            subject: 'foobar',
            handler: (doc) => doc.reschedule('+1m')
          }
        ],

        queue: {
          // Customize the queue name:
          name: 'foobar',

          // Fine tune the queue performances:
          // https://github.com/fetchq/node-client#queues-configuration
          settings: {}
        },
        
        worker: {
          // Fine tune the worker performances:
          // https://github.com/fetchq/node-client#workers-configuration
          settings: {}
        }
      }
    }
  }
})
```

## Add Tasks

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

## Task Configuration

### resetOnBoot

Set it to `true` and the task will be completely reset at boot time.
