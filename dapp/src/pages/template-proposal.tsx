import React from "react"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowLeft,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons"
import SNXIcon from "../assets/svgs/snx.svg"
import "github-markdown-css/github-markdown.css"

import SEO from "../components/seo"
import styled from "styled-components"
import {
  Text,
  proposalStatusToBadge,
  InvertedInfoBadge,
  Pill,
  GithubLink,
  Document,
  PanelItem,
  PanelItemInfo,
  PanelItemContainer,
  Content,
  DetailPanel,
  Title,
  Wrapper,
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
          <PanelItemContainer>
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
          </PanelItemContainer>
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
        <Document dangerouslySetInnerHTML={{ __html: html }} />
      </Content>
    </Wrapper>
  )
}

const IconText = styled(Text)`
  display: flex;
  align-items: center;

  svg {
    margin-right: 0.375rem;
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
            vote.member.type === "TEAM"
              ? "Core Contributor"
              : "Community Member"
          }
        >
          {vote.member.type === "TEAM" ? "CC" : "CM"}
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
