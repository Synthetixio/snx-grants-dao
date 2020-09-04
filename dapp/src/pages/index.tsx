import React, { useEffect } from "react"
import { navigate, PageProps } from "gatsby"

const IndexPage: React.FC<PageProps> = () => {
  useEffect(() => {
    navigate("/proposals/", { replace: true })
  }, [])

  return null
}

export default IndexPage
