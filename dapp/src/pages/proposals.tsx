import React from "react"
import { Router } from "@reach/router"

import ProposalsPage from "./proposals/list"
import ProposalPage from "./proposals/detail"

const Proposals = () => {
  return (
    <Router basepath="/proposals">
      <ProposalsPage path="/" />
      <ProposalPage path=":proposalId/" />
    </Router>
  )
}

export default Proposals
