import express from 'express'
import createSSRRouter from '@marcopeg/react-ssr/lib/create-ssr-router'
import { graphQLHandler } from './graphql'

// polyfill "fetch" in NodeJS
require('es6-promise').polyfill()
require('isomorphic-fetch')

export default async () => {
    const app = express()
    app.use('/api', graphQLHandler)
    app.use(createSSRRouter())
    app.listen(8080)
}
