import React, { useEffect, useMemo } from "react"
import { graphql, PageProps, useStaticQuery, Link } from "gatsby"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import parseISO from "date-fns/parseISO"

import SEO from "../components/seo"
import Tabs from "../components/tabs"
import { Section, Pill, Text } from "../components/common"
import Table from "../components/table"

const REQUESTS_PAGE_QUERY = graphql`
  query RequestsPage {
    grantsdao {
      systemInfo: systemInfos {
        proposalCount
        totalBalance
      }
    }

    allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/requests//" } }) {
      edges {
        node {
          parent {
            ... on File {
              name
              birthTime
              modifiedTime
            }
          }
          headings(depth: h2) {
            value
          }
          frontmatter {
            status
          }
        }
      }
    }
  }
`

const RequestsPage: React.FC<PageProps> = () => {
  const {
    grantsdao: { systemInfo },
    allMarkdownRemark,
  } = useStaticQuery(REQUESTS_PAGE_QUERY)

  const requests = useMemo(() => remarkFilesToRequests(allMarkdownRemark), [
    allMarkdownRemark,
  ])

  const columns = useMemo(
    () => [
      {
        Header: "Title",
        accessor: "title",
        Cell: ({ row }) => (
          <Link
            to={"/requests/" + row.original.name}
            title={row.original.title}
          >
            <Text>{row.original.title}</Text>
          </Link>
        ),
      },
      {
        Header: "Last Modified",
        accessor: "modifiedAt",
        Cell: ({ value }) => (
          <Text title={parseISO(value).toUTCString()}>
            {formatDistanceToNow(parseISO(value)).toUpperCase()} AGO
          </Text>
        ),
      },
      {
        Header: "Created At",
        accessor: "createdAt",
        Cell: ({ value }) => (
          <Text title={parseISO(value).toUTCString()}>
            {formatDistanceToNow(parseISO(value)).toUpperCase()} AGO
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

  return (
    <>
      <SEO title="Requests" />

      <Tabs
        proposalsCount={systemInfo[0].proposalCount}
        requestsCount={allMarkdownRemark.edges.length}
        availableBalance={systemInfo[0].totalBalance}
      />

      <Section>
        Proposed <Pill size="sm">{requests.proposed.length}</Pill>
      </Section>

      <Table
        columns={columns}
        data={requests.proposed}
        initialState={tablesInitialState}
        noDataMessage="No Requests"
      />

      <Section>
        Completed <Pill size="sm">{requests.completed.length}</Pill>
      </Section>

      <Table
        columns={columns}
        data={requests.completed}
        initialState={tablesInitialState}
        noDataMessage="No Completed Requests"
      />

      <Section>
        Deprecated <Pill size="sm">{requests.deprecated.length}</Pill>
      </Section>

      <Table
        columns={columns}
        data={requests.deprecated}
        initialState={tablesInitialState}
        noDataMessage="No Deprecated Requests"
      />
    </>
  )
}

const remarkFilesToRequests = allMarkdownRemark => {
  const proposed = []
  const completed = []
  const deprecated = []
  const requests = { proposed, completed, deprecated }

  for (let { node } of allMarkdownRemark.edges) {
    const request = {
      name: node.parent.name,
      title: node.headings[0].value,
      createdAt: node.parent.birthTime,
      modifiedAt: node.parent.modifiedTime,
      status: node.frontmatter.status,
    }

    requests[request.status].push(request)
  }

  return requests
}

export default RequestsPage
