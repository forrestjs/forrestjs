import createSSRState from '@marcopeg/react-ssr/lib/create-ssr-state'
import features from './features'

const reducers = {
    app: (state = { name: 'CRA SSR' }) => state,
}

export const createState = createSSRState(reducers, features)
