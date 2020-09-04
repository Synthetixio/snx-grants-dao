import React, { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCopy } from "@fortawesome/free-solid-svg-icons"
import { useCopyToClipboard } from "react-use"
import ReactTooltip from "react-tooltip"

type Props = {
  tooltipMessage?: string
  tooltipMessageSuccess?: string
  value: string
}

const CopyToClipboard = ({
  value,
  tooltipMessage = "Copy value to clipboard",
  tooltipMessageSuccess = "Value copied to clipboard!",
}: Props) => {
  const [copied, setCopied] = useState("")
  const iconRef = useRef(null)
  const [state, copyToClipboard] = useCopyToClipboard()

  const tooltip = state.error
    ? "Unable to copy value: " + state.error.message
    : copied
    ? tooltipMessageSuccess
    : tooltipMessage

  const handleClick = () => {
    copyToClipboard(value)
    setCopied(value)
    ReactTooltip.hide(iconRef.current)
  }

  const handleMouseLeave = () => {
    setCopied("")
  }

  useEffect(() => {
    if (state.error || state.value) {
      ReactTooltip.show(iconRef.current)
    }
  }, [iconRef.current, state])

  const copyState = state.error ? "error" : copied ? "success" : "info"

  return (
    <StyledFontAwesomeIcon
      forwardedRef={iconRef}
      icon={faCopy}
      onClick={handleClick}
      onMouseLeave={handleMouseLeave}
      data-tip={tooltip}
      data-type={copyState}
    />
  )
}

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  font-size: 1.25rem;
  color: var(--color-1);
  opacity: 0.5;
  cursor: pointer;

  :hover {
    opacity: 0.7;
  }
`

export const CopyAddressToClipboard = props => {
  return (
    <CopyToClipboard
      tooltipMessage="Copy Address to clipboard"
      tooltipMessageSuccess="Address copied to clipboard!"
      {...props}
    />
  )
}

export default CopyToClipboard
