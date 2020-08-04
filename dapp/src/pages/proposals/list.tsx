import React, { useMemo } from "react"
import { Link } from "gatsby"
import { RouteComponentProps } from "@reach/router"
import { gql, useQuery } from "@apollo/client"
import styled from "styled-components"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import fromUnixTime from "date-fns/fromUnixTime"
import { useMedia } from "react-use"

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

const PROPOSALS_QUERY = gql`
  query Proposals {
    systemInfo(id: "current") {
      totalExecuted
      votingPhaseDuration
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
      amount
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
      amount
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
      amount
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
      amount
      status
      description
      createdAt
      modifiedAt
    }
  }
`

const ProposalsPage: React.FC<RouteComponentProps> = () => {
  const { data, loading, error } = useQuery(PROPOSALS_QUERY, {
    pollInterval: 5000,
  })
  const isWide = useMedia("(min-width: 768px)")
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
        Cell: ({ value, row }) => (
          <VoteCountColumn>
            <span>
              <strong>{value}</strong> {value === "1" ? "VOTE" : "VOTES"}
            </span>
            <strong>{formatNumber(row.original.amount)} SNX</strong>
          </VoteCountColumn>
        ),
      },
    ],
    []
  )
  const tablesInitialState = useMemo(
    () => ({
      sortBy: [{ id: "modifiedAt", desc: true }],
      hiddenColumns: isWide ? [] : ["createdAt", "modifiedAt", "status"],
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

      <Tabs />

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
        <span className="right">
          TRIBUTED {formatNumber(systemInfo.totalExecuted)} SNX
        </span>
      </Section>

      <Table
        columns={columns}
        data={completed}
        initialState={tablesInitialState}
        noDataMessage="No Completed Proposals"
      />

      <Section>
        Rejected{" "}
        <Pill size="sm">
          <p>{rejected.length}</p>
        </Pill>
      </Section>

      <Table
        columns={columns}
        data={rejected}
        initialState={tablesInitialState}
        noDataMessage="No Rejected Proposals"
      />
    </>
  )
}

const VoteCountColumn = styled(Text)`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.625rem;
  white-space: nowrap;
  line-height: 1rem;
`

export default ProposalsPage
