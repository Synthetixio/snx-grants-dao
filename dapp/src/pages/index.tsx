import React, { useEffect } from "react"
import { graphql, Link, PageProps, useStaticQuery } from "gatsby"
import styled from "styled-components"

import SEO from "../components/seo"

const HOME_PAGE_QUERY = graphql`
  query ProposalList {
    grantsdao {
      all: proposals(orderBy: createdAt) {
        number
        description
        amount
        receiver {
          address
          earned
        }
        proposer {
          account {
            address
          }
        }
      }

      proposed: proposals(
        where: { status: PROPOSED }
        orderBy: modifiedAt
        orderDirection: desc
      ) {
        number
        description
        approvals
        teamApproval
        createdAt
        modifiedAt
      }

      approved: proposals(
        where: { status: APPROVED }
        orderBy: createdAt
        orderDirection: desc
      ) {
        number
        description
        createdAt
        modifiedAt
      }

      rejected: proposals(
        where: { status: REJECTED }
        orderBy: createdAt
        orderDirection: desc
      ) {
        number
        description
        teamApproval
        createdAt
        modifiedAt
      }

      completed: proposals(
        where: { status: COMPLETED }
        orderBy: createdAt
        orderDirection: desc
      ) {
        number
        description
        createdAt
        modifiedAt
      }
    }
  }
`

const IndexPage: React.FC<PageProps> = () => {
  const { grantsdao: proposals } = useStaticQuery(HOME_PAGE_QUERY)

  // TODO: Remove after implement it, this effect just exists for logging purpose.
  useEffect(() => {
    console.log(JSON.stringify(proposals, null, 2))
  }, [proposals])

  return (
    <>
      <SEO title="Proposals" />

      <h2>Proposals</h2>
      <List>
        {proposals.all.map(({ number, description }) => (
          <Item key={`proposal-${number}`}>
            <Link to={`/proposal/${number}`}>
              {number}: {description}
            </Link>
          </Item>
        ))}
      </List>
    </>
  )
}

const List = styled.ul`
  padding: 0;
  list-style: none;
  background: white;
  border-radius: 4px;
`

const Item = styled.li`
  padding: 1rem;

  a {
    color: var(--color-1);
  }
`

export default IndexPage
