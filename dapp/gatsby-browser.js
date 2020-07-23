import React from "react"
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import fetch from "isomorphic-fetch"
import Layout from "./src/components/layout"
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css"
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core"
config.autoAddCss = false /* eslint-disable import/first */

const cache = new InMemoryCache()

export function wrapRootElement({ element }) {
  const client = new ApolloClient({
    uri: process.env.SUBGRAPH_URL,
    cache,
    fetch,
  })

  return <ApolloProvider client={client}>{element}</ApolloProvider>
}

export function wrapPageElement({ element, props }) {
  return <Layout {...props}>{element}</Layout>
}
