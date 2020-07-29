import { useMemo } from "react"
import { useWeb3React } from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers"
import { GrantsDaoAbiFactory } from "../../../types/ethers-contracts/GrantsDaoAbiContract"

export const addresses = {
  1: "0x86626E1BbBd0ce95ED52e0C5E19f371a6640B591",
  3: "0x5A3561dfae1C5c91355d4952E48ED8d5264E2D41",
}

export const useGrantsDaoContract = () => {
  const { active, chainId, library } = useWeb3React<Web3Provider>()
  const contract = useMemo(
    () =>
      active
        ? GrantsDaoAbiFactory.connect(addresses[chainId], library.getSigner())
        : null,
    [active, chainId, library]
  )

  return contract
}
