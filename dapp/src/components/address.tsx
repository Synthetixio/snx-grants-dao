import React from "react"
import styled from "styled-components"
import Jazzicon, { jsNumberForAddress } from "react-jazzicon"
import { shortenAccount } from "../utils"
import { Text } from "./common"

type Props = {
  address: string
  shortAccount?: boolean
}

const Address: React.FC<Props> = ({
  address,
  shortAccount = true,
  children,
  ...rest
}) => {
  return (
    <Wrapper {...rest}>
      <Jazzicon diameter={30} seed={jsNumberForAddress(address)} />
      <Text>{shortAccount ? shortenAccount(address) : address}</Text>
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
