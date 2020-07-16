import React, { useEffect } from "react"
import { graphql, PageProps, useStaticQuery } from "gatsby"

import SEO from "../components/seo"
import Tabs from "../components/tabs"

const REQUESTS_PAGE_QUERY = graphql`
  query RequestsPage {
    grantsdao {
      systemInfo: systemInfos {
        proposalCount
        totalBalance
      }
    }
  }
`

const RequestsPage: React.FC<PageProps> = () => {
  const {
    grantsdao: { systemInfo },
  } = useStaticQuery(REQUESTS_PAGE_QUERY)

  // TODO: Remove after implement it, this effect just exists for logging purpose.
  useEffect(() => {
    console.log(JSON.stringify({ systemInfo }, null, 2))
  }, [systemInfo])

  return (
    <>
      <SEO title="Requests" />

      <Tabs
        proposalsCount={systemInfo[0].proposalCount}
        requestsCount={"0"}
        availableBalance={systemInfo[0].totalBalance}
      />
    </>
  )
}

export default RequestsPage
