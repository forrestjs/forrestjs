
const prepHTML = (template, {
    html,
    head,
    body,
    state,
    jsBundles,
    cssBundles,
    disableJs,
    context,
}) => {
    let data = template
    data = data.replace('<html lang="en">', `<html ${html}>`)
    data = data.replace('</head>', `${head}${cssBundles.join('')}</head>`)

    // support for: 'styled-components'
    // this is optional and should be provided by the custom root component
    if (context && context.styledComponents) {
        const styleTags = context.styledComponents.getStyleTags()
        data = data.replace('</head>', `${styleTags}</head>`)
    }

    // avoid to send out the redux state if client js is disabled
    if (disableJs !== 'yes') {
        // eslint-disable-next-line
        data = data.replace('<div id="root"></div>', `<div id="root"></div><script>window.SERVER_DATA = ${JSON.stringify(state)};</script>`)
    }

    // react-loadable -- inject chunks
    if (disableJs !== 'yes') {
        data = data.replace('<script src="/static/js/main.', `${jsBundles.join('')}<script type="text/javascript" src="/static/js/main.`)
    }

    // inject the pre-rendered body of the application
    data = data.replace('<div id="root"></div>', `<div id="root">${body}</div>`)

    // remove bundle js (dev, experimental)
    if (disableJs === 'yes') {
        data = data.replace(/<script src="\/static\/js\/([^\s]*).js"><\/script>/g, '')
        data = data.replace(/<script.*>.*<\/script>/g, '')
    }

    return data
}

export default prepHTML
