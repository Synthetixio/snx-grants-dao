import React from "react"
import styled from "styled-components"
import Jazzicon, { jsNumberForAddress } from "react-jazzicon"
import { shortenAccount } from "../utils"
import { Text } from "./common"

type Props = {
  address: string
}

const Address: React.FC<Props> = ({ address, children }) => {
  return (
    <Wrapper>
      <Jazzicon diameter={30} seed={jsNumberForAddress(address)} />
      <Text>{shortenAccount(address)}</Text>
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  *:not(:first-child) {
    margin-left: 0.625rem;
  }

  ${Text} {
    display: inline-block;
    min-width: 4.25rem;
  }
`

export default Address
