const path = require(`path`)

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { data, errors } = await graphql(`
    query {
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
        },
      })
    })
  )
}
