import express from 'express'
import createSSRRouter from '@marcopeg/react-ssr/lib/create-ssr-router'

// polyfill "fetch" in NodeJS
require('es6-promise').polyfill();
require('isomorphic-fetch');

export default async () => {
    const app = express()
    app.use(createSSRRouter())
    app.listen(8080)
}
