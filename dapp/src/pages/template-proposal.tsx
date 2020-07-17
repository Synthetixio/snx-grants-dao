import React from "react"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"

import SEO from "../components/seo"
import styled from "styled-components"
import { Text } from "../components/common"
import Tabs from "../components/tabs"

const ProposalPage = ({ pageContext: { proposal, systemInfo, html } }) => {
  return (
    <Wrapper>
      <SEO title={`#${proposal.number}: ${proposal.description}`} />

      <Tabs
        proposalsCount={systemInfo.proposalCount}
        requestsCount={"0"}
        availableBalance={systemInfo.totalBalance}
      />

      <Title>
        <Link to="/proposals/">
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
        #{proposal.number}: {proposal.description}
      </Title>

      <Content>
        <StyledText dangerouslySetInnerHTML={{ __html: html }} />
      </Content>
    </Wrapper>
  )
}

const Wrapper = styled.section``

const Title = styled.h2`
  font-size: 1rem;
  text-transform: uppercase;
  margin: 2.25rem 0;

  a svg {
    color: var(--color-1);
    margin-right: 0.625rem;
    opacity: 0.5;
  }
`

const Content = styled.div`
  width: 100%;
  border-radius: 8px;
  box-shadow: 0px 0px 15px -4px rgba(212, 212, 212, 1);
  background-color: #fff;
  padding: 2rem;
  box-sizing: border-box;
`

const StyledText = styled(Text)`
  font-size: 0.75rem;
  line-height: 145%;
  text-align: justify;
  text-justify: inter-word;
`

export default ProposalPage
