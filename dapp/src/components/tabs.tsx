import React from "react"
import styled from "styled-components"
import { Link, graphql, useStaticQuery } from "gatsby"
import { gql, useQuery } from "@apollo/client"
import { Pill } from "./common"
import { formatNumber } from "../utils"
import { useTotalBalance } from "../utils/hooks"

const REQUESTS_COUNT_QUERY = graphql`
  query RequestsCount {
    requests: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/requests//" } }
    ) {
      totalCount
    }
  }
`

const PROPOSALS_COUNT_QUERY = gql`
  query Proposals {
    systemInfo(id: "current") {
      proposalCount
    }
  }
`

const Tabs = () => {
  const { requests } = useStaticQuery(REQUESTS_COUNT_QUERY)
  const { data } = useQuery(PROPOSALS_COUNT_QUERY)
  const totalBalance = useTotalBalance()

  return (
    <Wrapper>
      <LinkItem
        to="/proposals/"
        activeClassName="active"
        partiallyActive={true}
      >
        Proposals{" "}
        <Pill size="md">
          <p>{data?.systemInfo.proposalCount || 0}</p>
        </Pill>
      </LinkItem>
      <LinkItem to="/requests/" activeClassName="active" partiallyActive={true}>
        Requests{" "}
        <Pill size="md">
          <p>{requests.totalCount}</p>
        </Pill>
      </LinkItem>
      <Rest>
        <span>Available {totalBalance} SNX</span>
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

    :not(.active) {
      border-bottom: 1px solid var(--color-6);
    }
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

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--color-6);

  ${LinkItem}:not(:first-child) {
    margin-left: 50px;
  }

  ${Rest} {
    display: none;

    @media (min-width: 768px) {
      display: block;
    }
  }
`

export default Tabs
