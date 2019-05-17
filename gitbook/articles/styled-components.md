# styled-components

[styled-components](https://www.styled-components.com) is a very nice styling library
for React, and it is quite easy to have it SRRed using the app's context.

The **first step** is to create a `StyleSheetManager` context for your app when it is
handled by Node. Change your `index.ssr.js` like this:

    ...
    import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

    ...
    const Root = ({ store, location, context, ...props }) => {
        context.styledComponents = context.styledComponents || new ServerStyleSheet()

        return (
            <StyleSheetManager sheet={context.styledComponents.instance}>
                ... router > redux provider > app
            </StyleSheetManager>
        )
    }

The **second step** is to inject all the inline styles in the resulting HTML. We do that
as part of the app's configuration in `ssr/boot.js`:

    ...
    settings.express = {
        ...
        ssr: {
            ...
            postprocessHtml: (html, { context }) =>
                (context && context.styledComponents)
                    ? html.replace('</head>', `${context.styledComponents.getStyleTags()}</head>`)
                    : html,
        }
    }

---

**IMPORTANT:** if you use the key `styledComponents` in your Root's context, you can
**skip step n.2** as it is been added to the default HTML preparation logic
starting from version 0.3.0 :-)

---

If you want to get deeper into this, here is the [link to the documentation page](https://github.com/styled-components/styled-components-website/blob/master/sections/advanced/server-side-rendering.md) 
of styled-components.