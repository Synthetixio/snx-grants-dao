require("dotenv/config")
const path = require("path")

module.exports = {
  siteMetadata: {
    title: `Synthetix GrantsDAO DApp`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-favicon`,
      options: {
        logo: `${path.join(__dirname, "./src/images/snx.svg")}`,
      },
    },
    `gatsby-plugin-sharp`,
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

    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /images/,
        },
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
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${path.join(__dirname, "../requests")}`,
        name: "requests-pages",
        ignore: [`**/request-template.md`],
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 590,
            },
          },
        ],
      },
    },
  ],
}
