import React from "react"
import { Link } from "gatsby"

import SEO from "../components/seo"
import styled from "styled-components"

const ProposalPage = ({ pageContext: { proposal } }) => {
  return (
    <Wrapper>
      <SEO title={`#${proposal.number}: ${proposal.description}`} />
      <Title>
        #{proposal.number}: {proposal.description}
      </Title>
      <Content>
        <p>(content here)</p>
      </Content>
      <Link to="/">← Back</Link>
    </Wrapper>
  )
}

const Wrapper = styled.section``

const Title = styled.h2``

const Content = styled.div`
  margin: 2rem 0;
`

export default ProposalPage
