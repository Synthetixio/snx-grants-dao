import React from "react"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import "github-markdown-css/github-markdown.css"
import parseISO from "date-fns/parseISO"

import SEO from "../components/seo"
import styled from "styled-components"
import { Text, GithubLink, requestStatusToBadge } from "../components/common"
import Tabs from "../components/tabs"
import { formatDate } from "../utils"

const ProposalPage = ({
  pageContext: { request, requestsCount, systemInfo },
}) => {
  return (
    <Wrapper>
      <SEO title={request.title} />

      <Tabs
        proposalsCount={systemInfo.proposalCount}
        requestsCount={requestsCount}
        availableBalance={systemInfo.totalBalance}
      />

      <Title>
        <Link to="/requests/">
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
        {request.title}
      </Title>

      <Content>
        <DetailPanel>
          <PanelItem>
            <label>Status</label>
            {requestStatusToBadge(request.status)}
          </PanelItem>
          <StyledFlexContainer>
            <PanelItem>
              <label>Created At</label>
              <Text>{formatDate(parseISO(request.createdAt))}</Text>
            </PanelItem>
            <PanelItem>
              <label>Modified At</label>
              <Text>{formatDate(parseISO(request.modifiedAt))}</Text>
            </PanelItem>
          </StyledFlexContainer>
          <PanelItem>
            <GithubLink
              text="Read this Request on Github"
              href={
                "https://github.com/Synthetixio/snx-grants-dao/blob/master/requests/" +
                request.filename
              }
            ></GithubLink>
          </PanelItem>
        </DetailPanel>
        <StyledText
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: request.html }}
        />
      </Content>
    </Wrapper>
  )
}

const Wrapper = styled.section``

const Title = styled.h2`
  display: flex;
  align-items: center;
  font-size: 1rem;
  text-transform: uppercase;
  margin: 2.25rem 0;

  a svg {
    font-size: 1.5rem;
    color: var(--color-1);
    margin-right: 0.625rem;
    opacity: 0.5;
  }
`

const Content = styled.div`
  display: flex;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0px 0px 15px -4px rgba(212, 212, 212, 1);
  background-color: #fff;
  padding: 2rem;
  box-sizing: border-box;
  letter-spacing: normal;
`

const StyledText = styled(Text)`
  font-size: 0.75rem;
  width: 70%;
`

const PanelItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 0.75rem;

  > :not(:last-child) {
    margin-bottom: 0.5rem;
  }

  label {
    font-family: Montserrat;
    font-weight: 700;
  }
`

const PanelItemInfo = styled(PanelItem)`
  background-color: var(--color-4);
  padding: 0.75rem;
  border-radius: 10px;
`

const DetailPanel = styled.div`
  width: 30%;
  position: sticky;
  top: 0;
  align-self: flex-start;
  padding-right: 1.5rem;

  ${PanelItem}, ${PanelItemInfo} {
    margin-top: 1rem;
  }
`

const StyledFlexContainer = styled.div`
  display: flex;

  ${PanelItem} {
    flex: 1;
  }
`

export default ProposalPage
