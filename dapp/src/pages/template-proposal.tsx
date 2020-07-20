import React from "react"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowLeft,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons"
import SNXIcon from "../images/snx.svg"
import "github-markdown-css/github-markdown.css"

import SEO from "../components/seo"
import styled from "styled-components"
import {
  Text,
  proposalStatusToBadge,
  InvertedInfoBadge,
  Pill,
  GithubLink,
} from "../components/common"
import Tabs from "../components/tabs"
import Address from "../components/address"
import {
  formatNumber,
  toShortDate,
  getProposalEndDate,
  formatDateTime,
  toShortDateTime,
} from "../utils"
import { CopyAddressToClipboard } from "../components/copyToClipboard"

const ProposalPage = ({
  pageContext: { proposal, systemInfo, html, requestsTotalCount },
}) => {
  return (
    <Wrapper>
      <SEO title={`#${proposal.number} ${proposal.description}`} />

      <Tabs
        proposalsCount={systemInfo.proposalCount}
        requestsCount={requestsTotalCount}
        availableBalance={systemInfo.totalBalance}
      />

      <Title>
        <Link to="/proposals/">
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
        #{proposal.number} {proposal.description}
      </Title>

      <Content>
        <DetailPanel>
          <PanelItem>
            <label>Status</label>
            {proposal.status === "PROPOSED" ? (
              <InvertedInfoBadge>Proposed</InvertedInfoBadge>
            ) : null}
            {proposalStatusToBadge(proposal, systemInfo)}
          </PanelItem>
          <PanelItem>
            <label>Proposer</label>
            <Address address={proposal.proposer.account.address}>
              <CopyAddressToClipboard
                value={proposal.proposer.account.address}
              />
            </Address>
          </PanelItem>
          <PanelItem>
            <label>Beneficiary</label>
            <Address address={proposal.receiver.address}>
              <CopyAddressToClipboard value={proposal.receiver.address} />
            </Address>
          </PanelItem>
          <PanelItem>
            <label>Price</label>
            <IconText>
              <SNXIcon />
              {formatNumber(proposal.amount)} SNX
            </IconText>
          </PanelItem>
          <StyledFlexContainer>
            <PanelItem>
              <label>Created At</label>
              <Text>{toShortDate(proposal.createdAt)}</Text>
            </PanelItem>
            <PanelItem>
              <label>End</label>
              <Text>
                {formatDateTime(
                  getProposalEndDate(
                    proposal.createdAt,
                    systemInfo.votingPhaseDuration
                  )
                )}
              </Text>
            </PanelItem>
          </StyledFlexContainer>
          <PanelItem>
            <label>Votes</label>
            <Votes votes={proposal.votes} />
          </PanelItem>
          <PanelItemInfo>
            <span>
              <strong>
                Voted {proposal.votes.length} of {systemInfo.memberCount}
              </strong>{" "}
              members
            </span>
            {proposal.status === "COMPLETED" ? null : (
              <span>
                Needs{" "}
                <strong>
                  {systemInfo.votesToPass - proposal.votes.length} vote
                </strong>{" "}
                for approval
              </span>
            )}
          </PanelItemInfo>
          <PanelItem>
            <GithubLink
              text="Read this Proposal on Github"
              href={proposal.url}
            ></GithubLink>
          </PanelItem>
        </DetailPanel>
        <StyledText
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: html }}
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

const IconText = styled(Text)`
  display: flex;
  align-items: center;

  svg {
    margin-right: 0.375rem;
  }
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

const Votes = ({ votes }) => {
  return votes
    .sort((a, b) => {
      if (a.member.type !== b.member.type && a.member.type === "TEAM") {
        return -1
      }

      if (
        a.member.type === b.member.type &&
        a.member.type === "COMMUNITY" &&
        a.approve
      ) {
        return -1
      }
    })
    .map(vote => (
      <Address
        key={vote.member.account.address}
        address={vote.member.account.address}
      >
        <VoteTypePill
          size="sm"
          type={vote.member.type}
          data-tip={
            vote.member.type === "TEAM" ? "Team Member" : "Community Member"
          }
        >
          {vote.member.type === "TEAM" ? "TM" : "CM"}
        </VoteTypePill>
        <VoteApprovePill
          size="sm"
          approve={vote.approve}
          data-tip={toShortDateTime(vote.timestamp)}
        >
          <FontAwesomeIcon icon={vote.approve ? faCheck : faTimes} />
        </VoteApprovePill>
      </Address>
    ))
}

type VoteTypePillProps = {
  type: "TEAM" | "COMMUNITY"
}
const VoteTypePill = styled(Pill)<VoteTypePillProps>`
  color: #fff;
  background-color: ${props =>
    props.type === "TEAM" ? "var(--color-1)" : "var(--color-3)"};
`

type VoteApprovePillProps = {
  approve: boolean
}
const VoteApprovePill = styled(Pill)<VoteApprovePillProps>`
  color: #fff;
  background-color: ${props =>
    props.approve ? "var(--color-5)" : "var(--color-7)"};
`

export default ProposalPage
