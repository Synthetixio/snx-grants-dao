import React from "react"
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import { Web3ReactProvider } from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers"
import { ToastProvider } from "react-toast-notifications"
import { useInactiveListener, useEagerConnect } from "./src/utils/hooks"
import fetch from "isomorphic-fetch"
import Layout from "./src/components/layout"
import Toast from "./src/components/toast"
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

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ToastProvider placement="bottom-right" components={{ Toast: Toast }}>
        <ApolloProvider client={client}>{element}</ApolloProvider>
      </ToastProvider>
    </Web3ReactProvider>
  )
}

const Wrapper = props => {
  return <Page {...props} />
}

const Page = ({ element, props }) => {
  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager)

  return <Layout {...props}>{element}</Layout>
}

export const wrapPageElement = Wrapper

function getLibrary(provider) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}
