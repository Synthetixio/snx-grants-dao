require("dotenv/config")
const path = require("path")

module.exports = {
  siteMetadata: {
    title: `Synthetix GrantsDAO DApp`,
  },
  plugins: [
    // Configure React Helmet
    {
      resolve: "gatsby-plugin-react-helmet",
    },

    // TODO: Generate web app manifest

    // Automatically generates files to configure HTTP headers and redirects for Netlify
    {
      resolve: "gatsby-plugin-netlify",
      options: {
        generateMatchPathRewrites: true, // turn off automatic creation of redirect rules for client only paths
      },
    },

    // Pass some environment variables to client-side modules
    {
      resolve: `gatsby-plugin-env-variables`,
      options: {
        whitelist: ["SUBGRAPH_URL"],
      },
    },

    // Configure Styled Components
    {
      resolve: "gatsby-plugin-styled-components",
      options: {
        fileName: false,
      },
    },

    // Static data sources
    {
      resolve: "gatsby-source-graphql",
      options: {
        typeName: "GrantsDAO",
        fieldName: "grantsdao",
        url: process.env.SUBGRAPH_URL,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${path.join(__dirname, "../proposals")}`,
        name: "proposals-pages",
      },
    },
    "gatsby-transformer-remark",
  ],
}
