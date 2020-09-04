import { InjectedConnector } from "@web3-react/injected-connector"
import { SUPPORTED_NETWORKS } from "./network"

export const injected = new InjectedConnector({
  supportedChainIds: Object.keys(SUPPORTED_NETWORKS).map(Number),
})
