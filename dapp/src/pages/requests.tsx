import React, { useMemo } from "react"
import { graphql, PageProps, useStaticQuery, Link } from "gatsby"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import parseISO from "date-fns/parseISO"

import SEO from "../components/seo"
import Tabs from "../components/tabs"
import { Section, Pill, Text } from "../components/common"
import Table, { TitleLink } from "../components/table"

const REQUESTS_PAGE_QUERY = graphql`
  query RequestsPage {
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
  const { allMarkdownRemark } = useStaticQuery(REQUESTS_PAGE_QUERY)

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
            <TitleLink>{row.original.title}</TitleLink>
          </Link>
        ),
      },
      {
        Header: "Last Modified",
        accessor: "modifiedAt",
        Cell: ({ value }) =>
          value ? (
            <Text title={parseISO(value).toUTCString()}>
              {formatDistanceToNow(parseISO(value)).toUpperCase()} AGO
            </Text>
          ) : (
            ""
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

      <Tabs />

      <Section>
        Proposed{" "}
        <Pill size="sm">
          <p>{requests.proposed.length}</p>
        </Pill>
      </Section>

      <Table
        columns={columns}
        data={requests.proposed}
        initialState={tablesInitialState}
        noDataMessage="No Requests"
      />

      <Section>
        Completed{" "}
        <Pill size="sm">
          <p>{requests.completed.length}</p>
        </Pill>
      </Section>

      <Table
        columns={columns}
        data={requests.completed}
        initialState={tablesInitialState}
        noDataMessage="No Completed Requests"
      />

      <Section>
        Deprecated{" "}
        <Pill size="sm">
          <p>{requests.deprecated.length}</p>
        </Pill>
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
