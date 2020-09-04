import React from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"

const Loading = props => {
  return (
    <LoadingContainer {...props}>
      <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
      Loading
    </LoadingContainer>
  )
}

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    margin-right: 0.75rem;
  }
`

export default Loading
