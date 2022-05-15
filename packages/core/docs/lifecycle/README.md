## App Boot Lifecycle in ForrestJS

The Boot Lifecycle is composed by a list of **asynchronous** Extensions created by ForrestJS during the booting of your App.

```js
// Only available to Services
$START            serie
$SETTINGS         serie

// Availabe to Services and Features
$INIT_SERVICES    parallel
$INIT_SERVICE     serie
$INIT_FEATURES    parallel
$INIT_FEATURE     serie

$START_SERVICES   parallel
$START_SERVICE    serie
$START_FEATURES   parallel
$START_FEATURE    serie

$FINISH           serie
```

👉 Each lifecycle Extension provides the App's Context as first parameter into the Action's handler.

```js
registerAction({
  target: '$INIT_FEATURE',
  handler: (ctx) => {
    ctx.getConfig('foo.bar');
  },
});
```

🔥 All the lifecycle Extensions are ASYNCHRONOUS.  
👉 You can use `async/await` in your Action's handlers, or return promises:

```js
// Assuming you are running `service-pg`
registerAction({
  target: '$START_FEATURE',
  handler: async ({ getContext }) => {
    const query = getContext('pg.query');
    await query('SELECT NOW()');
  },
});
```
