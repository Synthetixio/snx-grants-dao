import React, { useEffect, useMemo } from "react"
import { graphql, PageProps, useStaticQuery, Link } from "gatsby"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import fromUnixTime from "date-fns/fromUnixTime"
import addSeconds from "date-fns/addSeconds"
import isFuture from "date-fns/isFuture"

import SEO from "../../components/seo"
import Tabs from "../../components/tabs"
import {
  Pill,
  Section,
  InfoBadge,
  PrimaryBadge,
  DangerBadge,
  Text,
} from "../../components/common"
import Table from "../../components/table"

const PROPOSALS_PAGE_QUERY = graphql`
  query ProposalsPage {
    grantsdao {
      systemInfo(id: "current") {
        proposalCount
        totalBalance
        totalExecuted
      }

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
        voteCount
        createdAt
        modifiedAt
      }

      approved: proposals(
        where: { status: APPROVED }
        orderBy: createdAt
        orderDirection: desc
      ) {
        number
        voteCount
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
        voteCount
        status
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
        voteCount
        status
        description
        createdAt
        modifiedAt
      }
    }
  }
`

const ProposalsPage: React.FC<PageProps> = () => {
  const {
    grantsdao: { systemInfo, all, proposed, approved, completed, rejected },
  } = useStaticQuery(PROPOSALS_PAGE_QUERY)
  const columns = useMemo(
    () => [
      {
        Header: "Title",
        accessor: "description",
        Cell: ({ row }) => (
          <Link
            to={"/proposals/" + row.original.number}
            title={row.original.description}
          >
            <Text>
              <strong>#{row.original.number}</strong> {row.original.description}
            </Text>
          </Link>
        ),
      },
      {
        Header: "Last Modified",
        accessor: "modifiedAt",
        Cell: ({ value }) => (
          <Text title={fromUnixTime(value).toUTCString()}>
            {formatDistanceToNow(fromUnixTime(value)).toUpperCase()} AGO
          </Text>
        ),
      },
      {
        Header: "Created At",
        accessor: "createdAt",
        Cell: ({ value }) => (
          <Text title={fromUnixTime(value).toUTCString()}>
            {formatDistanceToNow(fromUnixTime(value)).toUpperCase()} AGO
          </Text>
        ),
      },
      {
        Header: "",
        accessor: "status",
        Cell: ({ row }) => statusToBadge(row.original, systemInfo),
      },
      {
        Header: "",
        accessor: "voteCount",
        Cell: ({ value }) => (
          <Text style={{ whiteSpace: "nowrap" }}>
            <strong>{value}</strong> VOTES
          </Text>
        ),
      },
    ],
    []
  )
  const tablesInitialState = useMemo(
    () => ({
      sortBy: [{ id: "modifiedAt", desc: true }],
    }),
    []
  )

  const totalExecuted = useMemo(
    () => new Intl.NumberFormat().format(Number(systemInfo.totalExecuted)),
    systemInfo
  )

  return (
    <>
      <SEO title="Proposals" />

      <Tabs
        proposalsCount={systemInfo.proposalCount}
        requestsCount={"0"}
        availableBalance={systemInfo.totalBalance}
      />

      <Section>
        Proposed <Pill size="sm">{proposed.length}</Pill>
      </Section>

      <Table
        columns={columns}
        data={proposed}
        initialState={tablesInitialState}
        noDataMessage="No Proposals"
      />

      <Section>
        Approved <Pill size="sm">{approved.length}</Pill>{" "}
        <span className="right">TRIBUTED {totalExecuted} SNX</span>
      </Section>

      <Table
        columns={columns}
        data={approved}
        initialState={tablesInitialState}
        noDataMessage="No Approved Proposals"
      />

      <Section>
        Completed <Pill size="sm">{completed.length}</Pill>
      </Section>

      <Table
        columns={columns}
        data={completed.concat(rejected)}
        initialState={tablesInitialState}
        noDataMessage="No Completed Proposals"
      />
    </>
  )
}

const statusToBadge = (proposal, systemInfo) => {
  if (proposal.status === "COMPLETED") {
    return <PrimaryBadge>Completed</PrimaryBadge>
  }

  if (proposal.status === "REJECTED") {
    return <DangerBadge>Rejected</DangerBadge>
  }

  if (proposal.status === "PROPOSED") {
    const inVotingPeriod = isFuture(
      addSeconds(
        fromUnixTime(proposal.createdAt),
        systemInfo.votingPhaseDuration
      )
    )

    return inVotingPeriod ? (
      <InfoBadge>In Voting</InfoBadge>
    ) : (
      <DangerBadge>Expired</DangerBadge>
    )
  }

  return null
}

export default ProposalsPage
