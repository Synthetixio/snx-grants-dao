import invert from "lodash/invert"

export const SUPPORTED_NETWORKS = {
  1: "MAINNET",
  3: "ROPSTEN",
  //4: "RINKEBY",
  //42: "KOVAN",
}

export const SUPPORTED_NETWORKS_MAP = invert(SUPPORTED_NETWORKS)

export const isMainNet = networkId =>
  String(networkId) === SUPPORTED_NETWORKS_MAP.MAINNET

const getEtherScanBaseURL = networkId => {
  const network = SUPPORTED_NETWORKS[networkId]

  if (isMainNet(networkId) || !network) {
    return "https://etherscan.io"
  }

  return `https://${network.toLowerCase()}.etherscan.io`
}

export const getEtherscanTxLink = (networkId, txId) => {
  const baseURL = getEtherScanBaseURL(networkId)

  return `${baseURL}/tx/${txId}`
}
