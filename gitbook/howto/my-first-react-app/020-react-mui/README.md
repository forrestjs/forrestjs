<h1 class="tutorial-step"><span>My First React App &raquo;</span> Add Material UI Component Library</h1>

[My First React App](../README.md) &raquo; [Add Material UI Component Library](./README.md)

---

# Add Material UI Component Library

[MaterialUI](https://mui.com) is a nice and quite complete _Component Library_ for React. You can build so much with the out-of-the-box components, and it offers a quite extensive customization API.

In a normal React App you would follow the MUI tutorial to set it up, and you would have to wrap your _Root Component_ with the _MUI Provider_.

> Long story short, it **would** take some coding.

In a ForrestJS React App thing are much different, as the only thing you would need is to add the relative service [react-mui](https://github.com/forrestjs/react/tree/main/packages/react-mui#readme):

```js
// Import the service:
import reactMUI from '@forrestjs/react-mui';

// Just add the service:
forrestjs.run({
  services: [reactRoot, reactMUI],
});
```

Well, you also have to (optionally) import the Roboto font in your `/public/index.html`:

```html
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
/>
```

## Use a MUI Component

🧐 How do I know it works for real?

That's a fair question. Let's modify our basic Feature so to actually use a MUI Component.

First let's import a few MUI Components:

```js
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
```

And then let's use them in our custom Root Component:

```js
const MyComponent = () => (
  <Box sx={{ margin: 5 }}>
    <Typography>My First React App - with MaterialUI</Typography>
    <Link href="https://mui.com" color="primary" variant="body2">
      Open MUI Documentation
    </Link>
  </Box>
);

const customRoot = {
  target: '$REACT_ROOT_COMPONENT',
  handler: { component: MyComponent },
};
```

<iframe src="https://codesandbox.io/embed/020-react-mui-1hwk7?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="020-react-mui"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
