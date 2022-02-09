<h1 class="tutorial-step"><span>My First React App &raquo;</span> Refactor Your First Feature</h1>

[My First React App](../README.md) &raquo; [Refactor Your First Feature](./README.md)

---

# Refactor Your First Feature

The code from the previous tutorial works just fine, but it mixes up _Manifest_ responsibilities with _rendering_ ones.

**👉 IT'S NOT GOOD TO MIX UP DIFFERENT RESPONSIBILITIES 👈**

In this tutorial we will refactor the code we wrote so to implement [SRP](https://en.wikipedia.org/wiki/Single-responsibility_principle) almost religiously.

## The CustomRoot Component

The core business of this first feature of ours is to hook into the [`react-root` Service](https://github.com/forrestjs/react/tree/main/packages/react-root) and provide a custom component to render.

Such component will use some MUI components render something real useful.

Let's start by creating this React Component in `/src/custom-root/CustomRoot.js`:

```js
// MUI Components:
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

// MUI Icons:
import StarIcon from '@mui/icons-material/Star';

// My Component:
export const CustomRoot = () => (
  <Box>
    <AppBar position="static">
      <Toolbar>
        <StarIcon />
        <Typography>CustomComponent</Typography>
      </Toolbar>
    </AppBar>
    <Typography>My First React App with MaterialUI</Typography>
    <Link href="https://mui.com" color="primary" variant="body2">
      Open MUI Documentation
    </Link>
  </Box>
);
```

This is technically a **dumb component**. The most important thing to notice, for the sake of understanding ForrestJS properly, is that **this component has nothing to do with ForrestJS**.

It's just pure React code.

[![Edit 030-first-feature](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/030-first-feature-64umk?fontsize=14&hidenavigation=1&module=%2Fsrc%2Fcustom-root%2FCustomRoot.js&theme=dark)

## The Feature Manifest

As we saw quite clearly in the [My First REST API Tutorial](../../my-first-rest-api/README.md), a ForrestJS Feature consist in a Manifest file that explains **how to integrate custom business logic with the rest of the application**.

So let's build our `/src/custom-component/index.js` Manifest and tell ForrestJS to use our CustomComponent in the ReactRoot Service:

```js
// Import the custom logic written in React
import { CustomRoot } from './CustomRoot';

// Explain how to integrate our custom logic
// with the rest of the App:
export default {
  target: '$REACT_ROOT_COMPONENT',
  handler: { component: CustomRoot },
};
```

[![Edit 030-first-feature](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/030-first-feature-64umk?fontsize=14&hidenavigation=1&module=%2Fsrc%2Fcustom-root%2Findex.js&theme=dark)

## The App Manifest

Now that our Feature is complete it is time to refactor the App's manifest `/src/index.js` so to use it:

```js
// Import Libraries:
import forrestjs from '@forrestjs/core';

// Import Services:
import reactRoot from '@forrestjs/react-root';
import reactMUI from '@forrestjs/react-mui';

// Import Features:
import customRoot from './custom-root';

forrestjs
  .run({
    services: [reactRoot, reactMUI],
    features: [customRoot],
  })
  .catch((err) => console.error(`Boot: ${err.message}`));
```

Here is the full source code that you can run, fork, and play with:

<iframe src="https://codesandbox.io/embed/030-first-feature-64umk?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="030-first-feature"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
