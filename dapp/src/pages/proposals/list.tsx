import React, { useMemo } from "react"
import { graphql, useStaticQuery, Link } from "gatsby"
import { RouteComponentProps } from "@reach/router"
import { gql, useQuery } from "@apollo/client"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import fromUnixTime from "date-fns/fromUnixTime"

import SEO from "../../components/seo"
import Tabs from "../../components/tabs"
import {
  Pill,
  Section,
  Text,
  proposalStatusToBadge,
  ErrorMessage,
} from "../../components/common"
import Table, { TitleLink } from "../../components/table"
import { formatNumber } from "../../utils"
import Loading from "../../components/loading"

const REQUESTS_COUNT_QUERY = graphql`
  query RequestsCount {
    requests: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/requests//" } }
    ) {
      totalCount
    }
  }
`

const PROPOSALS_QUERY = gql`
  query Proposals {
    systemInfo(id: "current") {
      proposalCount
      totalBalance
      totalExecuted
      votingPhaseDuration
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
`

const ProposalsPage: React.FC<RouteComponentProps> = () => {
  const { requests } = useStaticQuery(REQUESTS_COUNT_QUERY)
  const { data, loading, error } = useQuery(PROPOSALS_QUERY)
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
            <TitleLink>
              <strong>#{row.original.number}</strong> {row.original.description}
            </TitleLink>
          </Link>
        ),
      },
      {
        Header: "Last Modified",
        accessor: "modifiedAt",
        Cell: ({ value }) =>
          value ? (
            <Text title={fromUnixTime(value).toUTCString()}>
              {formatDistanceToNow(fromUnixTime(value)).toUpperCase()} AGO
            </Text>
          ) : (
            ""
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
        Cell: ({ row }) => proposalStatusToBadge(row.original, systemInfo),
      },
      {
        Header: "",
        accessor: "voteCount",
        Cell: ({ value }) => (
          <Text style={{ whiteSpace: "nowrap" }}>
            <strong>{value}</strong> {value === "1" ? "VOTE" : "VOTES"}
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

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <ErrorMessage>{error.message || error.toString()}</ErrorMessage>
  }

  const { systemInfo, proposed, approved, completed, rejected } = data

  return (
    <>
      <SEO title="Proposals" />

      <Tabs
        proposalsCount={systemInfo.proposalCount}
        requestsCount={requests.totalCount}
        availableBalance={systemInfo.totalBalance}
      />

      <Section>
        Proposed{" "}
        <Pill size="sm">
          <p>{proposed.length}</p>
        </Pill>
      </Section>

      <Table
        columns={columns}
        data={proposed}
        initialState={tablesInitialState}
        noDataMessage="No Proposals"
      />

      <Section>
        Approved{" "}
        <Pill size="sm">
          <p>{approved.length}</p>
        </Pill>{" "}
        <span className="right">
          TRIBUTED {formatNumber(systemInfo.totalExecuted)} SNX
        </span>
      </Section>

      <Table
        columns={columns}
        data={approved}
        initialState={tablesInitialState}
        noDataMessage="No Approved Proposals"
      />

      <Section>
        Completed{" "}
        <Pill size="sm">
          <p>{completed.length}</p>
        </Pill>
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

export default ProposalsPage
