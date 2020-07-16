const path = require(`path`)

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { data, errors } = await graphql(`
    query {
      grantsdao {
        proposals(orderBy: createdAt) {
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
      }
    }
  `)

  if (errors) {
    reporter.panicOnBuild(`Error while running GraphQL query`)
    return
  }

  const proposalPageTemplate = path.resolve("./src/pages/template-proposal.tsx")

  // Create one page for each proposal
  data.grantsdao.proposals.forEach(proposal => {
    actions.createPage({
      path: `/proposals/${proposal.number}`,
      component: proposalPageTemplate,
      context: {
        proposal,
      },
    })
  })
}
