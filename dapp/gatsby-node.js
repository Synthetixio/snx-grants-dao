const path = require(`path`)

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { data, errors } = await graphql(`
    query {
      grantsdao {
        systemInfo(id: "current") {
          proposalCount
          totalBalance
          totalExecuted
        }

        proposals(orderBy: createdAt) {
          number
          description
          amount
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
  data.grantsdao.proposals.forEach(async proposal => {
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
}
