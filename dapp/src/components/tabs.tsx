import React, { useMemo } from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { Pill } from "./common"

type Props = {
  proposalsCount: string
  requestsCount: string
  availableBalance: string
}

const Tabs = ({ proposalsCount, requestsCount, availableBalance }: Props) => {
  const formattedBalance = useMemo(
    () => new Intl.NumberFormat().format(Number(availableBalance)),
    [availableBalance]
  )

  return (
    <Wrapper>
      <LinkItem to="/proposals/" activeClassName="active">
        Proposals <Pill size="md">{proposalsCount}</Pill>
      </LinkItem>
      <LinkItem to="/requests/" activeClassName="active">
        Requests <Pill size="md">{requestsCount}</Pill>
      </LinkItem>
      <Rest>
        <span>Available {formattedBalance} SNX</span>
      </Rest>
    </Wrapper>
  )
}

const LinkItem = styled(Link)`
  font-size: 1.125rem;
  text-transform: uppercase;
  padding: 1rem 0;

  &.active {
    font-weight: 900;
    border-bottom: 2px solid var(--color-3);
  }

  &:hover {
    text-decoration: none;
  }
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--color-6);

  ${LinkItem}:not(:first-child) {
    margin-left: 50px;
  }
`

const Rest = styled.div`
  flex: 1;
  text-align: right;

  span {
    font-weight: 700;
    text-transform: uppercase;
  }
`

export default Tabs
