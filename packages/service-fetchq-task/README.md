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
// Declarative form:
// you can return one single task, or an array of tasks
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
];

// Functional form:
// you can return one single task, or an array of tasks
const myFeature = () => [
  {
    target: "$FETCHQ_REGISTER_TASK",
    handler: [
      {
        // Document in the tasks' queue:
        subject: "cqrs-todos",
        payload: { target: "todos" },
        // Worker for this specific task:
        handler: (doc, ctx) => {
          console.log("cqrs-todos", doc.payload);
          return doc.reschedule("+1s");
        }
      },
      {
        subject: 'foobar',
        handler: d => d.complete()
      }
    ]
  }
];
```

## Task Configuration

> `subject` and `handler` are mandatory.

### subject

type: `String`

### payload

type: `Object`

### firstIteration

type: `Time (absolute or relative)`

Delay the first execution of the task.

```js
{
  firstIteration: '+1h',
  firstIteration: '1970-01-01 10:22',
}
```

### nextIteration

type: `Time (absolute or relative)`

If provided, it schedules the task for a next execution when the handler completes returning `undefined`.

```js
{
  firstIteration: '+1h',
  firstIteration: '1970-01-01 10:22',
}
```

### handler

type: `Function`
args: `doc`, `ctx`

Provide the logic to perform for the task.  

👉 [Refer to the Fetchq documentation for details on the arguments and returning value](https://github.com/fetchq/node-client#the-handler-function).

The hander can return a valid [Fetchq Action](https://github.com/fetchq/node-client#returning-actions), or simply skip returning.

In case of returning `undefined`, the task will be rescheduled according to the `nextIteration` setting.

In case `nextIteration` was not provided, the task will be marked as completed (single execution mode).

### resetOnBoot

type: `Boolean`

Set it to `true` and the task will be completely reset at boot time.

## APIs

### Run a Task

You can programmatically run any task immediately:

```js
const run = getContext('fetchq.task.run');
await run('taskSubject', 'log info message')
```

> The log message is optional.


### Reset a Task

You can programmatically reset any task to its original state:

```js
const reset = getContext('fetchq.task.reset');
await reset('taskSubject', 'log info message')
```

> The log message is optional.
