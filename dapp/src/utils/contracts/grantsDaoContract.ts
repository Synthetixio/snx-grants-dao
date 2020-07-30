import { useMemo } from "react"
import { useWeb3React } from "@web3-react/core"
import { getDefaultProvider } from "ethers"
import { Web3Provider } from "@ethersproject/providers"
import { GrantsDaoAbiFactory } from "../../../types/ethers-contracts/GrantsDaoAbiContract"

export const addresses = {
  1: "0x86626E1BbBd0ce95ED52e0C5E19f371a6640B591",
  3: "0x5A3561dfae1C5c91355d4952E48ED8d5264E2D41",
}

export const useGrantsDaoContract = () => {
  const { active, chainId, library } = useWeb3React<Web3Provider>()
  const contract = useMemo(() => {
    if (active) {
      return GrantsDaoAbiFactory.connect(
        addresses[chainId],
        library.getSigner()
      )
    }

    return GrantsDaoAbiFactory.connect(
      addresses[process.env.GATSBY_SUBGRAPH_NETWORK_ID],
      getDefaultProvider(NETWORK_MAP[process.env.GATSBY_SUBGRAPH_NETWORK_ID])
    )
  }, [active, chainId, library])

  return contract
}

const NETWORK_MAP = {
  1: "homestead",
  3: "ropsten",
  4: "rinkeby",
  5: "goerli",
  42: "kovan",
}
