import React, { useState } from "react"
import styled from "styled-components"
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core"
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector"
import { Web3Provider } from "@ethersproject/providers"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
import {
  Button as AriaButton,
  Wrapper,
  Menu,
  MenuItem,
} from "react-aria-menubutton"
import MetamaskLogo from "../assets/images/metamask.png"
import { injected } from "../utils/connectors"
import Address from "./address"
import { Badge } from "./common"
import { PrimaryButton, SecondaryButton } from "./button"

const ConnectToWallet = () => {
  const context = useWeb3React<Web3Provider>()
  const {
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error,
  } = context
  console.log(context)
  const handleOnConnect = async () => {
    await activate(injected, error => {
      console.error(error)
    })
  }

  const handleOnDisconnect = () => {
    deactivate()
  }

  return (
    <Container>
      {active ? (
        <>
          <NetworkBadge>{networkIdToName[chainId]}</NetworkBadge>
          <StyledMenuWrapper className="AriaMenuButton">
            <AriaButton className="AriaMenuButton-trigger">
              <StyledAddress address={account}>
                <FontAwesomeIcon icon={faChevronDown} />
              </StyledAddress>
            </AriaButton>
            <Menu className="AriaMenuButton-menu">
              <MenuItem className="item">
                <img src={MetamaskLogo} alt="Metamask Logo" />
                <PrimaryButton onClick={handleOnDisconnect}>
                  Disconnect
                </PrimaryButton>
              </MenuItem>
            </Menu>
          </StyledMenuWrapper>
        </>
      ) : (
        <SecondaryButton onClick={handleOnConnect}>
          Connect to Wallet
        </SecondaryButton>
      )}
    </Container>
  )
}

function getErrorMessage(error: Error) {
  if (error instanceof NoEthereumProviderError) {
    return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile."
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network."
  } else if (error instanceof UserRejectedRequestErrorInjected) {
    return "Please authorize this website to access your Ethereum account."
  } else {
    console.error(error)
    return "An unknown error occurred. Check the console for more details."
  }
}

const networkIdToName = {
  1: "mainnet",
  3: "ropsten",
  4: "rinkeby",
}

const NetworkBadge = styled(Badge)`
  font-size: 0.5rem;
  color: var(--color-1);
  background-color: var(--color-6);
`

const StyledAddress = styled(Address)`
  cursor: pointer;
  padding: 0.3125rem;
  border-radius: 8px;
  user-select: none;

  :hover {
    background-color: var(--color-6-light);
  }

  .fa-chevron-down {
    opacity: 0.5;
  }
`

const Container = styled.div`
  font-family: Montserrat, sans-serif;
  font-size: 0.75rem;
  display: flex;
  justify-content: flex-end;
  flex: 1;
  align-items: center;
  margin-right: 1.5rem;

  ${NetworkBadge} {
    margin-right: 1.5rem;
  }
`

const StyledMenuWrapper = styled(Wrapper)`
  display: inline-block;
  position: relative;

  .AriaMenuButton-trigger {
    :focus {
      outline: 0;
    }
  }

  .AriaMenuButton-menu {
    background: #fff;
    list-style-type: none;
    position: absolute;
    right: -6px;
    z-index: 99;
    margin: 8px 0 0 0;
    width: 170px;
    box-shadow: 0px 21px 14px -11px rgba(0, 0, 0, 0.25);
  }

  .item {
    list-style: none;
    font-size: 0.8rem;
    font-weight: bold;
    text-transform: uppercase;
    margin: 1rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;

    :focus {
      outline: 0;
    }

    img {
      width: 100px;
      height: auto;
      margin-bottom: 1rem;
    }
  }
`

export default ConnectToWallet
