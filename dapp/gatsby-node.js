const path = require(`path`)

exports.createPages = async ({ graphql, actions, reporter }) => {
  await createProposals({ graphql, actions, reporter })
  await createRequests({ graphql, actions, reporter })
}

const createProposals = async ({ graphql, actions, reporter }) => {
  const { data, errors } = await graphql(`
    query {
      requests: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/requests//" } }
      ) {
        totalCount
      }

      grantsdao {
        systemInfo(id: "current") {
          proposalCount
          totalBalance
          totalExecuted
          votingPhaseDuration
          votesToPass
          memberCount
        }

        proposals(orderBy: createdAt) {
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
    }
  `)

  if (errors) {
    reporter.panicOnBuild(`Error while running GraphQL query`)
    return
  }

  const proposalPageTemplate = path.resolve("./src/pages/template-proposal.tsx")

  // Create one page for each proposal
  await Promise.all(
    data.grantsdao.proposals.map(async proposal => {
      const proposalFile = proposal.url.substring(
        proposal.url.lastIndexOf("/") + 1
      )
      const { data: markDownRemarkData, errors } = await graphql(`
      query {
        markdownRemark(
          fileAbsolutePath: { regex: "/${proposalFile}$/" }
        ) {
          id
          fileAbsolutePath
          html
          timeToRead
          wordCount {
            paragraphs
            sentences
            words
          }
        }
      }
    `)

      actions.createPage({
        path: `/proposals/${proposal.number}`,
        component: proposalPageTemplate,
        context: {
          proposal,
          systemInfo: data.grantsdao.systemInfo,
          html: markDownRemarkData.markdownRemark.html,
          requestsTotalCount: data.requests.totalCount,
        },
      })
    })
  )
}

const createRequests = async ({ graphql, actions, reporter }) => {
  const { data, errors } = await graphql(`
    query {
      grantsdao {
        systemInfo(id: "current") {
          proposalCount
          totalBalance
        }
      }

      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/requests//" } }
      ) {
        edges {
          node {
            html
            parent {
              ... on File {
                name
                birthTime
                modifiedTime
                relativePath
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
  `)

  if (errors) {
    reporter.panicOnBuild(`Error while running GraphQL query`)
    return
  }

  const requestPageTemplate = path.resolve("./src/pages/template-request.tsx")

  // Create one page for each request
  data.allMarkdownRemark.edges.map(({ node }) => {
    const request = {
      name: node.parent.name,
      title: node.headings[0].value,
      createdAt: node.parent.birthTime,
      modifiedAt: node.parent.modifiedTime,
      filename: node.parent.relativePath,
      status: node.frontmatter.status,
      html: node.html,
    }

    actions.createPage({
      path: `/requests/${request.name}`,
      component: requestPageTemplate,
      context: {
        request,
        requestsCount: data.allMarkdownRemark.edges.length,
        systemInfo: data.grantsdao.systemInfo,
      },
    })
  })
}
