import React, { useCallback, useEffect, useState } from "react"
import styled from "styled-components"
import { useToasts } from "react-toast-notifications"
import { Link } from "gatsby"
import { useWeb3React } from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons"
import { PrimaryButton, SecondaryButton } from "./button"
import { getEtherscanTxLink } from "../utils/network"

type TxState = "pending" | "confirmed" | "failed"

const Toast = ({
  appearance,
  children,
  onDismiss,
  txHash,
  transitionState,
  ...rest
}) => {
  const { chainId, library } = useWeb3React<Web3Provider>()
  const [txState, setTxState] = useState<TxState>("pending")

  useEffect(() => {
    if (!library) {
      return
    }

    library
      .waitForTransaction(txHash)
      .then(() => {
        setTxState("confirmed")
      })
      .catch(error => {
        console.error(error)
        setTxState("failed")
      })
  }, [txHash, library])

  return (
    <ToastContainer className={transitionState}>
      <TransactionStatus status={txState} />
      {children}
      <ButtonContainer>
        <SecondaryButton onClick={onDismiss}>Close</SecondaryButton>
        <PrimaryButton
          as={Link}
          to={getEtherscanTxLink(chainId, txHash)}
          target="blank"
        >
          View on Etherscan
        </PrimaryButton>
      </ButtonContainer>
    </ToastContainer>
  )
}

export const useTxToast = () => {
  const { addToast } = useToasts()

  const addTxToast = useCallback(
    ({ title, description, txHash }) =>
      addToast(
        <>
          <h3>
            <strong>{title}</strong>
          </h3>
          <p>{description}</p>
        </>,
        { txHash: txHash }
      ),
    [addToast]
  )

  return { addTxToast }
}

const TransactionStatus = ({ status }: { status: TxState }) => {
  return (
    <TransactionStatusContainer>
      {statusToIcon(status)}
    </TransactionStatusContainer>
  )
}

const statusToIcon = status => {
  switch (status) {
    case "pending":
      return (
        <>
          <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
          <span>Waiting for confirmations</span>
        </>
      )
    case "confirmed":
      return (
        <>
          <FontAwesomeIcon icon={faCheck} className="confirmed" />
          <span>Transaction confirmed</span>
        </>
      )
    case "failed":
      return (
        <>
          <FontAwesomeIcon icon={faTimes} className="failed" />
          <span>Transaction Failed</span>
        </>
      )
    default:
      throw "Invalid status"
  }
}

const TransactionStatusContainer = styled.div`
  display: flex;
  align-items: center;

  svg {
    &.confirmed {
      color: var(--color-5);
    }

    &.failed {
      color: var(--color-7);
    }
  }

  span {
    font-size: 0.625rem;
    margin-left: 0.5rem;
  }
`

const ToastContainer = styled.div`
  width: 400px;
  padding: 1rem;
  margin-top: 1rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 6px 2px var(--color-6);
  transition: 1s;
  opacity: 0;

  ${TransactionStatusContainer} {
    margin-bottom: 0.5rem;
  }

  > h3 {
    font-size: 1rem;
    margin: 0 0 0.75rem 0;
  }

  > p {
    font-size: 0.75rem;
    margin-bottom: 0.5rem;
  }

  &.entered {
    opacity: 1;
  }

  &.exited {
    opacity: 0;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;

  > a,
  button {
    font-size: 0.75rem;
  }
`

export default Toast
