import React, { useState, useCallback } from "react"
import styled from "styled-components"
import AriaModal from "react-aria-modal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { PrimaryButton, SecondaryButton } from "./button"

const ConfirmationModal = ({ title, content, onConfirm, onCancel }) => {
  const getApplicationNode = useCallback(() => {
    return document.getElementById("___gatsby")
  }, [])

  return (
    <AriaModal
      titleText={title}
      onExit={onCancel}
      initialFocus="#confirmation-modal-cancel"
      getApplicationNode={getApplicationNode}
      scrollDisabled={false}
      verticallyCenter
    >
      <ModalContainer>
        <header className="modal-header">
          {title}
          <FontAwesomeIcon
            id="confirmation-modal-cancel"
            icon={faTimes}
            onClick={onCancel}
          ></FontAwesomeIcon>
        </header>
        <div className="modal-body">{content}</div>
        <footer className="modal-footer">
          <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
          <PrimaryButton onClick={onConfirm}>Confirm</PrimaryButton>
        </footer>
      </ModalContainer>
    </AriaModal>
  )
}

let ConfirmationModalContext
const { Provider } = (ConfirmationModalContext = React.createContext(null))

const ConfirmationModalProvider = ({ children }) => {
  const [modal, setModal] = useState(null)
  const confirmAction = useCallback(content => {
    return new Promise((resolve, reject) => {
      setModal(
        <ConfirmationModal
          title="Confirm Action"
          content={content}
          onConfirm={() => {
            resolve()
            setModal(null)
          }}
          onCancel={() => {
            reject()
            setModal(null)
          }}
        />
      )
    })
  }, [])

  return (
    <Provider value={{ confirmAction }}>
      {children}
      {modal}
    </Provider>
  )
}

const ModalContainer = styled.div`
  width: 400px;
  background-color: #fff;
  box-shadow: 0px 0px 15px -4px #000;

  .modal-header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    padding: 1rem;
    border-bottom: 2px solid var(--color-6);

    svg {
      opacity: 0.5;

      :hover {
        opacity: 0.7;
      }
    }
  }

  .modal-body {
    padding: 1rem;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    padding: 1rem;

    > * {
      margin-left: 1rem;
    }
  }
`

export { ConfirmationModalContext, ConfirmationModalProvider }
