import React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"
import MetamaskLogo from "../assets/images/metamask.png"

interface SEOProps {
  lang?: string
  title: string
}

const SEO: React.FC<SEOProps> = ({ title, lang }) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            author
            title
          }
        }
      }
    `
  )

  return (
    <Helmet
      htmlAttributes={{ lang }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      link={[{ rel: "preload", href: MetamaskLogo, as: "image" }]}
      meta={[
        {
          name: `description`,
          content: site.siteMetadata.title,
        },
        {
          property: `og:image`,
          content: "/snx-grantsdao.png",
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: site.siteMetadata.title,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: site.siteMetadata.title,
        },
      ]}
    />
  )
}

SEO.defaultProps = {
  lang: `en`,
}

export default SEO
