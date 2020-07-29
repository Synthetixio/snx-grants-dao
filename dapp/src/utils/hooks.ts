import { useState, useEffect } from "react"
import { useWeb3React } from "@web3-react/core"
import { gql, useQuery } from "@apollo/client"
import { Web3Provider } from "@ethersproject/providers"
import { utils } from "ethers"
import toLower from "lodash/toLower"
import { injected } from "./connectors"
import { useGrantsDaoContract } from "./contracts/grantsDaoContract"
import { formatNumber } from "."

export function useEagerConnect() {
  const { activate, active } = useWeb3React<Web3Provider>()

  const [tried, setTried] = useState(false)

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true)
        })
      } else {
        setTried(true)
      }
    })
  }, []) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true)
    }
  }, [tried, active])

  return tried
}

export function useInactiveListener(suppress: boolean = false) {
  const { active, error, activate } = useWeb3React<Web3Provider>()

  useEffect((): any => {
    const { ethereum } = window as any
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        console.log("Handling 'connect' event")
        activate(injected)
      }
      const handleChainChanged = (chainId: string | number) => {
        console.log("Handling 'chainChanged' event with payload", chainId)
        activate(injected)
      }
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("Handling 'accountsChanged' event with payload", accounts)
        if (accounts.length > 0) {
          activate(injected)
        }
      }
      const handleNetworkChanged = (networkId: string | number) => {
        console.log("Handling 'networkChanged' event with payload", networkId)
        activate(injected)
      }

      ethereum.on("connect", handleConnect)
      ethereum.on("chainChanged", handleChainChanged)
      ethereum.on("accountsChanged", handleAccountsChanged)
      ethereum.on("networkChanged", handleNetworkChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("connect", handleConnect)
          ethereum.removeListener("chainChanged", handleChainChanged)
          ethereum.removeListener("accountsChanged", handleAccountsChanged)
          ethereum.removeListener("networkChanged", handleNetworkChanged)
        }
      }
    }
  }, [active, error, suppress, activate])
}

const MEMBERS_QUERY = gql`
  query MEMBERS {
    members {
      id
      type
    }
  }
`

export const useAccount = () => {
  const { active, account } = useWeb3React<Web3Provider>()
  const { data, error } = useQuery(MEMBERS_QUERY, { skip: !active })
  const [state, setState] = useState({
    isMember: false,
    isCommunityMember: false,
    isTeamMember: false,
    type: "",
  })
  useEffect(() => {
    if (data) {
      const member = data.members.find(
        member => toLower(member.id) === toLower(account)
      )
      setState({
        isMember: !!member,
        isCommunityMember: member?.type === "COMMUNITY",
        isTeamMember: member?.type === "TEAM",
        type: member?.type,
      })
    }
  }, [data, account])

  useEffect(() => {
    if (!active) {
      setState({
        isMember: false,
        isCommunityMember: false,
        isTeamMember: false,
        type: "",
      })
    }
  }, [active])

  return { active, error, account, ...state }
}

export const useTotalBalance = () => {
  const grantsDaoContract = useGrantsDaoContract()
  const [totalBalance, setTotalBalance] = useState("0")

  useEffect(() => {
    if (grantsDaoContract) {
      grantsDaoContract
        .totalBalance()
        .then(totalBalance =>
          setTotalBalance(formatNumber(Number(utils.formatEther(totalBalance))))
        )
    }
  }, [grantsDaoContract])

  return totalBalance
}
