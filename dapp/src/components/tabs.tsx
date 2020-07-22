import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { Pill } from "./common"
import { formatNumber } from "../utils"

type Props = {
  proposalsCount: string
  requestsCount: string
  availableBalance: string
}

const Tabs = ({ proposalsCount, requestsCount, availableBalance }: Props) => {
  return (
    <Wrapper>
      <LinkItem
        to="/proposals/"
        activeClassName="active"
        partiallyActive={true}
      >
        Proposals <Pill size="md"><p>{proposalsCount}</p></Pill>
      </LinkItem>
      <LinkItem to="/requests/" activeClassName="active" partiallyActive={true}>
        Requests <Pill size="md"><p>{requestsCount}</p></Pill>
      </LinkItem>
      <Rest>
        <span>Available {formatNumber(Number(availableBalance))} SNX</span>
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
