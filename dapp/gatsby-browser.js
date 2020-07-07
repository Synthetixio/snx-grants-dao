import React from "react"
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"

import Layout from "./src/components/layout"

const cache = new InMemoryCache()

export function wrapRootElement({ element }) {
  const client = new ApolloClient({
    uri: process.env.SUBGRAPH_URL,
    cache,
  })

  return <ApolloProvider client={client}>{element}</ApolloProvider>
}

export function wrapPageElement({ element, props }) {
  return <Layout {...props}>{element}</Layout>
}
