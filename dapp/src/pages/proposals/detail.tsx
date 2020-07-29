import React, { useContext, useState, useMemo } from "react"
import { gql, useQuery } from "@apollo/client"
import styled from "styled-components"
import { Link, graphql, useStaticQuery } from "gatsby"
import { RouteComponentProps } from "@reach/router"
import toLower from "lodash/toLower"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowLeft,
  faCheck,
  faTimes,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons"
import "github-markdown-css/github-markdown.css"
import SNXIcon from "../../assets/svgs/snx.svg"
import SEO from "../../components/seo"
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
  ErrorMessage,
} from "../../components/common"
import Tabs from "../../components/tabs"
import Address from "../../components/address"
import {
  formatNumber,
  toShortDate,
  getProposalEndDate,
  formatDateTime,
  toShortDateTime,
  inVotingPeriod,
} from "../../utils"
import { CopyAddressToClipboard } from "../../components/copyToClipboard"
import { PrimaryButton } from "../../components/button"
import { ConfirmationModalContext } from "../../components/confirmationModal"
import { useGrantsDaoContract } from "../../utils/contracts/grantsDaoContract"
import { useTxToast } from "../../components/toast"
import Loading from "../../components/loading"
import { useAccount } from "../../utils/hooks"

const PROPOSAL_QUERY = gql`
  query ProposalDetail($id: ID!) {
    systemInfo(id: "current") {
      totalExecuted
      votingPhaseDuration
      votesToPass
      memberCount
    }

    proposal(id: $id) {
      number
      status
      description
      approvals
      amount
      createdAt
      url
      receiver {
        address
        earned
      }
      proposer {
        account {
          address
        }
      }
      votes {
        timestamp
        approve
        member {
          type
          account {
            address
          }
        }
      }
    }
  }
`

const STATIC_QUERY = graphql`
  query {
    proposalDocuments: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/proposals//" } }
    ) {
      nodes {
        fileAbsolutePath
        html
      }
    }
  }
`

type Props = {
  proposalId?: string
} & RouteComponentProps

const ProposalPage = ({ proposalId }: Props) => {
  const { data, loading, error: apolloError } = useQuery(PROPOSAL_QUERY, {
    variables: { id: proposalId },
  })
  const { proposalDocuments } = useStaticQuery(STATIC_QUERY)
  const html = useMemo(() => {
    if (data?.proposal) {
      const proposalFile = data.proposal.url.substring(
        data.proposal.url.lastIndexOf("/") + 1
      )

      const documentNode = proposalDocuments.nodes.find(node =>
        new RegExp(`${proposalFile}$`).test(node.fileAbsolutePath)
      )

      if (documentNode) {
        return documentNode.html
      }
    }
  }, [data, proposalDocuments])
  const { confirmAction } = useContext(ConfirmationModalContext)
  const { addTxToast } = useTxToast()
  const [pendingTx, setPendingTx] = useState(false)
  const [error, setError] = useState()
  const grantsDaoContract = useGrantsDaoContract()
  const { isMember, account } = useAccount()
  const isInVotingPeriod = useMemo(() => {
    return (
      data &&
      inVotingPeriod(
        data.proposal.createdAt,
        data.systemInfo.votingPhaseDuration
      )
    )
  }, [data])
  const canVote = useMemo(() => {
    if (
      !data ||
      !isMember ||
      data.proposal.status === "COMPLETED" ||
      data.proposal.status === "REJECTED" ||
      !isInVotingPeriod
    ) {
      return false
    }

    // didn't vote
    return (
      data.proposal.votes.find(
        vote => toLower(vote.member.account.address) === toLower(account)
      ) === undefined
    )
  }, [isMember, data, account, isInVotingPeriod])

  const vote = async (approve: boolean) => {
    let vote

    try {
      if (approve) {
        await confirmAction(
          <>
            You are about to <strong>vote YES</strong>. Are you sure?
          </>
        )
        vote = true
      } else {
        await confirmAction(
          <>
            You are about to <strong>vote NO</strong>. Are you sure?
          </>
        )
        vote = false
      }
    } catch (error) {
      console.log("Vote action cancelled")
    }

    if (vote === undefined) {
      return
    }

    try {
      setPendingTx(true)
      setError(null)

      const tx = await grantsDaoContract.voteProposal(proposal.number, vote)

      addTxToast({
        title: "Vote Proposal",
        description: (
          <>
            Voted{" "}
            <strong>
              {vote ? "YES" : "NO"} for Proposal <em>{proposal.description}</em>
            </strong>
          </>
        ),
        txHash: tx.hash,
      })
    } catch (error) {
      console.error(error)
      setError(error.message || error)
    } finally {
      setPendingTx(false)
    }
  }

  const deleteProposal = async () => {
    try {
      await confirmAction("You are about to delete the proposal. Are you sure?")
    } catch (error) {
      console.log("Delete action cancelled")
      return
    }

    try {
      setPendingTx(true)
      setError(null)

      const tx = await grantsDaoContract.deleteProposal(proposal.number)

      addTxToast({
        title: "Delete Proposal",
        description: (
          <>
            Proposal <em>{proposal.description}</em> deleted
          </>
        ),
        txHash: tx.hash,
      })
    } catch (error) {
      console.error(error)
      setError(error.message || error)
    } finally {
      setPendingTx(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (apolloError) {
    return <ErrorMessage>{apolloError.message}</ErrorMessage>
  }

  const { systemInfo, proposal } = data

  return (
    <Wrapper>
      <SEO title={`#${proposal.number} ${proposal.description}`} />

      <Tabs />

      <Title>
        <DescriptionContainer>
          <Link to="/proposals/">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          #{proposal.number} {proposal.description}
        </DescriptionContainer>
        <div>
          {canVote && (
            <>
              <VoteYes onClick={() => vote(true)} disabled={pendingTx} />
              <VoteNo onClick={() => vote(false)} disabled={pendingTx} />
            </>
          )}
          {isMember && (
            <DeleteProposal onClick={deleteProposal} disabled={pendingTx} />
          )}
        </div>
      </Title>

      {error && (
        <>
          <ErrorMessage>{error}</ErrorMessage>
          <br />
        </>
      )}

      <Content>
        <DetailPanel>
          <PanelItem>
            <label>Status</label>
            {proposal.status === "PROPOSED" && (
              <InvertedInfoBadge>Proposed</InvertedInfoBadge>
            )}
            {proposal.status === "APPROVED" && (
              <InvertedInfoBadge>Approved</InvertedInfoBadge>
            )}
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
                  {systemInfo.votesToPass - proposal.approvals}{" "}
                  {systemInfo.votesToPass - proposal.approvals === 1
                    ? "vote"
                    : "votes"}
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
    .slice()
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

const VoteButton = styled(PrimaryButton)`
  display: inline;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  white-space: nowrap;

  :not(:first-child) {
    margin-left: 1rem;
  }

  ${Pill} {
    margin-left: 0.5rem;
  }

  @media (min-width: 768px) {
    margin-left: 1rem;
  }
`

const VoteYesButton = props => {
  return (
    <VoteButton {...props}>
      Vote <strong>YES</strong>
      <Pill size="sm">
        <FontAwesomeIcon icon={faCheck} />
      </Pill>
    </VoteButton>
  )
}

const VoteNoButton = props => {
  return (
    <VoteButton {...props}>
      Vote <strong>NO</strong>
      <Pill size="sm">
        <FontAwesomeIcon icon={faTimes} />
      </Pill>
    </VoteButton>
  )
}

const DeleteProposalButton = props => {
  return (
    <VoteButton {...props}>
      Delete
      <Pill size="sm">
        <FontAwesomeIcon icon={faTrashAlt} />
      </Pill>
    </VoteButton>
  )
}

const VoteYes = styled(VoteYesButton)`
  background-color: var(--color-5);

  :hover:not(:disabled),
  :focus:not(:disabled) {
    background-color: var(--color-5-dark);

    svg {
      color: var(--color-5-dark);
    }
  }

  ${Pill} {
    background-color: #fff;

    svg {
      color: var(--color-5);
    }
  }
`

const VoteNo = styled(VoteNoButton)`
  background-color: var(--color-7);

  :hover:not(:disabled),
  :focus:not(:disabled) {
    background-color: var(--color-7-dark);

    svg {
      color: var(--color-7-dark);
    }
  }

  ${Pill} {
    background-color: #fff;

    svg {
      color: var(--color-7);
    }
  }
`

const DeleteProposal = styled(DeleteProposalButton)`
  background-color: var(--color-8);

  :hover:not(:disabled),
  :focus:not(:disabled) {
    background-color: var(--color-8-dark);

    svg {
      color: var(--color-8-dark);
    }
  }

  ${Pill} {
    background-color: #fff;

    svg {
      color: var(--color-8);
    }
  }
`

const DescriptionContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    max-width: 45%;
    margin-bottom: 0;
  }
`

export default ProposalPage
