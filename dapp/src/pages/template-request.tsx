import React from "react"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import "github-markdown-css/github-markdown.css"
import parseISO from "date-fns/parseISO"

import SEO from "../components/seo"
import {
  Text,
  GithubLink,
  requestStatusToBadge,
  Document,
  PanelItem,
  PanelItemContainer,
  DetailPanel,
  Content,
  Title,
  Wrapper,
} from "../components/common"
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
          <PanelItemContainer>
            <PanelItem>
              <label>Created At</label>
              <Text>{formatDate(parseISO(request.createdAt))}</Text>
            </PanelItem>
            <PanelItem>
              <label>Modified At</label>
              <Text>{formatDate(parseISO(request.modifiedAt))}</Text>
            </PanelItem>
          </PanelItemContainer>
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
        <Document dangerouslySetInnerHTML={{ __html: request.html }} />
      </Content>
    </Wrapper>
  )
}

export default ProposalPage
