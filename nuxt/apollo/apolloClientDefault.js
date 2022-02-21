import { ApolloLink, concat, split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import 'subscriptions-transport-ws' // this is the default of apollo-link-ws

export default (ctx) => {
  const httpLink = new HttpLink({
    uri: 'http://localhost:4000',
  })
  const authMiddleware = new ApolloLink((operation, forward) => {
    const token = process.server
      ? ctx.req.session
      : window.__NUXT__.state.session
    operation.setContext({
      headers: {
        Authorization: token ? `Bearer ${token}` : null,
      },
    })
    return forward(operation)
  })
  // Set up subscription
  const wsLink = new WebSocketLink({
    uri: `ws://http://localhost:4000`,
  })

  const link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query)
      return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    httpLink
  )

  return {
    link: concat(authMiddleware, link),
    cache: new InMemoryCache(),
  }
}
