import { GraphQLString } from 'graphql'
import ssr from '@marcopeg/react-ssr/package.json'

export default {
    description: 'Provides info regarding the react-ssr version',
    type: GraphQLString,
    resolve: () => `${ssr.name} v${ssr.version}`,
}
