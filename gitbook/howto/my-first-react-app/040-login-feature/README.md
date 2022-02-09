<h1 class="tutorial-step"><span>My First React App &raquo;</span> The Login Feature</h1>

[My First React App](../README.md) &raquo; [The Login Feature](./README.md)

---

# The Login Feature

One classic functionality of any modern Web App is **to authenticate people in**.

> It's truly simple really: If you are authenticated you see "Screen A", else you see "Screen B". **Basically, a Login is just a glorified conditional**.

Let's build something like that together. The high level requirements are:

- It should hook into the `$REACT_ROOT_COMPONENT` provided by [`react-root` Service](https://github.com/forrestjs/react/tree/main/packages/react-root#readme) in order to block the rendering of the main App until authenticated
- If **NOT authenticated**, it should render a `LoginView` component providing the UI/UX for a user to sign in
- If authenticated, it should simply render the main App as defined by our existing "custom-root" feature
- The login status should be handled by a [React Context](https://reactjs.org/docs/context.html) that wraps the App
- 👉 _The login itself, is just a dummy in-memory boolean variable, but we want to simulate some asynchronous loading activity for sake of realism_

## The React Components

Let's start from the simple definition of a few React components that will handle the UI/UX of this feature:

## LoginView

This **dumb component** should handle the **NOT Authenticated** state, and provide a mean to enter the credentials and sign in.

`/src/login/LoginView.js`

```js
const LoginView = ({ login }) => {
  const onSubmit = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    login(evt.target.user.value);
  };

  return (
    <form onSubmit={onSubmit}>
      <input name="user" />
      <button type="submit">login</button>
    </form>
  );
};
```

[![Edit 040-login-feature-s1](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/040-login-feature-s1-mugq5?file=/src/login/LoginView.js)

## LoginRoot

This component is the one that should conditionally render the `LoginView` any time login is needed.

> This is a React _Container_ as it will have to be state-aware.

/src/login/LoginRoot.js

```js
const LoginRoot = ({ rootComponent }) => {
  // Get state info from a custom hook
  // (more about it later on)
  const { needLogin, ...loginAPI } = useLogin();

  // Block the main App and render the login screen:
  if (needLogin) {
    return <LoginView {...loginAPI} />;
  }

  // Render the main App and inject the login API in it:
  return cloneElement(rootComponent, loginAPI);
};
```

[![Edit 040-login-feature-s1](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/040-login-feature-s1-mugq5?file=/src/login/LoginRoot.js)

## Fake it First

We are now going to take a small shortcut and write a very simple and totally fake implementation of the `useLogin()` hook.

Why do we do so?

We fake it so that we can progressively run our solution and make sure that the components we wrote so far work properly. Afer all, at the moment we only need a `needLogin` boolean and a `login()` function to be passed down into the `LoginView` component.

Let's do that in `/src/login/use-login.js`:

```js
const useLogin = () => ({
  needLogin: true,
  login: () => {},
});
```

This is a perfectly viable fake hook. By manually changing the value of `needLogin` we can control which direction our `LoginRoot` will take.

A slightly more complicate fake hook, that could dynamically change the state of the App, hence better simulate the expected UX would be:

```js
const useLogin = () => {
  const [user, setUser] = useState(null);
  return {
    needLogin: !user,
    login: setUser,
  };
};
```

In this implementation we use the `useState` hook to store the login state, and we pass the modifier to the `login()` method. With this small piece of code, our App will behave as expected, even if it is not yet complete.

## The Feature Manifest - Part 1

We are ready to move into connect-the-dots time. We need to add out _login Feature_ into the App's manifest, and **make sure that it runs last**, so that we can catch the App's _root component_ as defined by our `custom-root` feature.

`/src/login/index.js`

```js
export default {
  priority: -1, // Make sure it runs LAST
  target: '$REACT_ROOT_COMPONENT',
  handler: (App) => ({ component: () => <LoginRoot rootComponent={App} /> }),
};
```

[![Edit 040-login-feature-s1](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/040-login-feature-s1-mugq5?file=/src/login/index.js)

There are two very important things to notice in the piece of code above.

### The Priority

We set a negative priority so to **make sure that our action fires last**, no matter the Feature's order in the App's manifest.

> The [action's priority](../../../api/register-action/README.md#the-handler-priority) regulates the execution order of the handler, from higher priority to the lower.

### The Waterfall

We really want our action to go last because we want to receive the App's root component as it was set by the `custom-root` Feature.

> This is possible because the `$REACT_ROOT_COMPONENT` hook fires in [_waterfall_ mode](../../../api/create-hook/README.md#createhookwaterfall), **each action will receive the output of the one before**.

Our handler receives the App's _root component_ `App` and passes it down to our `LoginLogic` that works as a React _HOC_: it renders it only when the user is authenticated.

## The LoginContext

Remember the time when we wrote a fake `useLogin()` hook? You do? Well, the time has come to de-fake it.

We should be able to use the `useLogin` hook all around the application, whenever we want to get details about the authentication state, or whenever we need to trigger an action such a _logout_.

> As long the implementation relies on a `useState` it won't work as each component will share its own state.

👉 The solution is to use [React's Context API](https://reactjs.org/docs/context.html) to store the Authentication state globally for the whole App, and the [useContext](https://reactjs.org/docs/hooks-reference.html#usecontext) hook to operate it.

### The LoginContextProvider Component

Let's start by creating the Context Provider for storing the Authentication state:

`/src/login/LoginContext.js`

```js
const LoginContext = createContext();

const LoginContextProvider = ({ app }) => (
  <LoginContext.Provider value={useState(null)} children={app} />
);
```

[![Edit 040-login-feature-s1](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/040-login-feature-s1-mugq5?file=/src/login/LoginContext.js)

Here we create a context and a custom provider component that will instrument our App with it.

In a normal React App you have the "context hell" issue, where you find a list of nested context providers like:

```js
<ReactRouter>
  <MaterialUI>
    <i18nContext.Provider>
      <LoginContext.Provider>
        <MyApp />
      </LoginContext.Provider>
    </i18nContext.Provider>
  </MaterialUI>
</ReactRouter>
```

> If you ask me, this is pretty awful and we get [this issue **solved for good** with ForrestJS](https://marcopeg.com/context-provider-hell/).

Our provider component receives the `app` property and **wraps it with whatever is needed only for this specific Feature**.

The state itself is just the User's name. It's a demo App so we don't really dig much into the theory and practice of a mutable React context.

Let's just say that the `LoginContextProvider` it's a regular React component, so it can use any kind of React hooks itself. By storing the result of a `useState` hook we guarantee a render action any time that such property changes its value.

## The Feature Manifest - Part 2

To put in place our `LoginContextProvider` we are going to register a new action as it is provided by the `react-root` service:

```js
registerAction({
  target: '$REACT_ROOT_WRAPPER',
  handler: { component: LoginContextProvider },
});
```

[![Edit 040-login-feature-s1](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/040-login-feature-s1-mugq5?file=/src/login/index.js:334-421)

This is just another waterfall hook, each Action handler will receive the previous value, and it is supposed to return it as well. Or, in our case, a wrapped version of it.

> Services like `react-mui` or `react-router` do exactly this.

## The Final useLogin()

With the LoginContext in place, we can refactor the `useLogin` so to benefit from a globally available Authentication state:

```js
import { LoginContext } from './LoginContext';

const useLogin = () => {
  const [user, setUser] = useContext(LoginContext);
  return {
    needLogin: !user,
    login: setUser,
  };
};
```

[![Edit 040-login-feature-s1](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/040-login-feature-s1-mugq5?file=/src/login/use-login.js)

By all means, we simply moved the `useState` to be part of the LoginContext instead of the hook's instance.

More than that, we also provide a `logout` API that can be used all around the application by simply using this hook.

### Export the useLogin

The last problem to solve is to make it possible for the use to logout.

Once logged in we render the `custom-root` Feature's component, and that Feature is supposed to be decoupled from the login.

We can bend this rule a little by saying that **cross-feature dependencies must be exported by the Feature's manifest**. In the `/src/login/index.js` you can add:

```js
export { useLogin } from './use-login';
```

And in `/src/custom-root/CustomRoot.js` we can now show the authenticated user's name, and logout:

```js
// Use the login state from the login Feature
import { useLogin } from '../login';

// My Component:
export const CustomRoot = () => {
  const { user, logout } = useLogin();

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <StarIcon />
          <Typography>Welcome {user}</Typography>
        </Toolbar>
      </AppBar>
      <Typography>My First React App with MaterialUI</Typography>
      <Link href="https://mui.com" color="primary" variant="body2">
        Open MUI Documentation
      </Link>

      <Button
        fullWidth
        variant="outlined"
        onClick={logout}
        sx={{ marginTop: 2 }}
      >
        Logout
      </Button>
    </Box>
  );
};
```

[![Edit 040-login-feature-s1](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/040-login-feature-s1-mugq5?file=/src/custom-root/CustomRoot.js)

## Working Examples

You can take a look at the basic source code as written following this tutorial:

<iframe src="https://codesandbox.io/embed/040-login-feature-s1-mugq5?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="040-login-feature-s1"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

And you can take a look to a slightly richer version of it, in which we also simulate an asynchronous login action that can fail, and implement error messages:

<iframe src="https://codesandbox.io/embed/040-login-feature-mewqg?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="040-login-feature-s2"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
