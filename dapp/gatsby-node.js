const path = require(`path`)

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions
  // Only update the `/app` page.
  if (page.path.match(/^\/proposals/)) {
    // page.matchPath is a special key that's used for matching pages
    // with corresponding routes only on the client.
    page.matchPath = "/proposals/*"
    // Update the page.
    createPage(page)
  }
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  await createRequests({ graphql, actions, reporter })
}

const createRequests = async ({ graphql, actions, reporter }) => {
  const { data, errors } = await graphql(`
    query {
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
      },
    })
  })
}

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html" || stage === "develop-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /ethers/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}
