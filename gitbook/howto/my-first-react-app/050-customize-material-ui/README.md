<h1 class="tutorial-step"><span>My First React App &raquo;</span> Customize Material UI</h1>

[My First React App](../README.md) &raquo; [Customize Material UI](./README.md)

---

# Customize Material UI

Now that we have a pretty decent App that authenticate a user and present 2 views composed using [MaterialUI](https://mui.com) components, it's about time we add our own skin to it.

> In this tutorial we aim to **apply multiple custom themes to Material UI**, and to provide a UI control to switch the current theme.

As you may imagine, the [`react-mui` Service](https://github.com/forrestjs/react/tree/main/packages/react-mui) offers a few hooks that may be useful to our purpose.

## Customize The Default Theme

The first step is to create a new Feature `/src/mui-theme/index.js`:

```js
export default {
  target: "$MUI_SET_THEME",
  handler: (theme) => ({
    ...theme,
    palette: {
      background: {
        default: '#E0F1F1'
      },
  })
};
```

Once you add this Feature to your App's manifest you will see the background color change.

> 👉 Of course, there are much more that you can [customize on MUI](https://mui.com/customization/default-theme/)!

[![Edit 050-customize-material-ui](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/050-customize-material-ui-1d932?file=/src/mui-theme/index.js:145-457)

## Add New Themes

It is possible, if not likely, that your application will need multiple themes (eg. Light / Dark mode) and a way to switch between them.

Normally, it would be a matter of creating context and custom hooks to manage all the logic. But thanks to ForrestJS it's just a matter to extend another target:

```js
registerAction({
  target: '$MUI_ADD_THEME',
  handler: () => ({
    name: 'orange', // <-- This is very important!
    palette: {
      background: {
        default: 'orange',
      },
    },
  }),
});
```

It's important to notice that we **must give a name** to the new theme. That's because is the only way that we have to set it as the active theme later on!

[![Edit 050-customize-material-ui](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/050-customize-material-ui-1d932?file=/src/mui-theme/index.js:541-861)

## Set The Active Theme

Once you add a few themes, you may want to set a particular one as the theme that is initially used by the application. If you do nothing, it will be the `default` one. It's the default choice 😉.

```js
registerAction({
  target: '$MUI_USE_THEME',
  handler: 'orange',
});
```

This hook only needs the name of the theme that must be used initially. Simple, uh?

[![Edit 050-customize-material-ui](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/050-customize-material-ui-1d932?file=/src/mui-theme/index.js:1116-1188)

## Switching Theme

What do you need multiple themes without a way to switch them? Let's hack into our `custom-root` Feature to add a simple theme switcher.

> In order to do so, we are going to use the `useMUITheme()` from the `react-mui` Service.

Let's build a component that presents a list of themes and let the user switch between them in `/src/custom-root/ThemeSwitch.js`:

```js
const ThemeSwitch = () => {
  const { applyMUITheme, currentMUITheme } = useMUITheme();
  const handleChange = (event) => applyMUITheme(event.target.value);

  return (
    <FormControl fullWidth sx={{ mt: 2 }} variant="filled">
      <InputLabel>Switch MUI Theme:</InputLabel>
      <Select value={currentMUITheme.name} onChange={handleChange}>
        <MenuItem value={'default'}>Default</MenuItem>
        <MenuItem value={'orange'}>Orange</MenuItem>
        <MenuItem value={'green'}>Green</MenuItem>
      </Select>
    </FormControl>
  );
};
```

Once you place this component into the `CustomRoot.js` you will finally get to enjoy the result:

<iframe src="https://codesandbox.io/embed/050-customize-material-ui-1d932?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="050-customize-material-ui"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
