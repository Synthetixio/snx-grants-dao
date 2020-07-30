import React, { useCallback, useState } from "react"
import { Link, navigate } from "gatsby"
import styled from "styled-components"
import { useForm } from "react-hook-form"
import { utils } from "ethers"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import SEO from "../components/seo"
import {
  Title,
  ErrorMessage,
  Input,
  InputError,
  Form,
  InputGroup,
  ButtonContainer,
} from "../components/common"
import { PrimaryButton, SecondaryButton } from "../components/button"
import { useGrantsDaoContract } from "../utils/contracts/grantsDaoContract"
import { useTxToast } from "../components/toast"
import { validMarkdownUrl } from "../utils"

const CreateProposalPage = () => {
  const [error, setError] = useState("")
  const { register, handleSubmit, errors, formState } = useForm()
  const { addTxToast } = useTxToast()
  const grantsDaoContract = useGrantsDaoContract()

  const onSubmit = useCallback(
    async values => {
      try {
        const tx = await grantsDaoContract.createProposal(
          values.receiver,
          utils.parseEther(values.amount),
          values.description,
          values.link
        )

        addTxToast({
          title: "Create Proposal",
          description: values.description,
          txHash: tx.hash,
        })

        await navigate("/proposals/")
      } catch (error) {
        setError(error.message || error)
      }
    },
    [grantsDaoContract]
  )

  const { isSubmitting } = formState

  return (
    <>
      <SEO title="Create proposal" />

      <Title>
        <Link to="/proposals/">
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
        Create Proposal
      </Title>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup>
          <label>Description</label>
          <Input
            name="description"
            ref={register({ required: true })}
            disabled={isSubmitting}
            autoFocus
          />
          {errors.description && (
            <InputError>Please enter a description</InputError>
          )}
        </InputGroup>

        <InputGroup>
          <label>Link</label>
          <Input
            name="link"
            ref={register({
              required: true,
              validate: value => validMarkdownUrl(value),
            })}
            disabled={isSubmitting}
          />
          {errors.link && (
            <InputError>
              Please enter a valid proposal's document URL
            </InputError>
          )}
        </InputGroup>

        <InputGroup>
          <label>Tribute Amount (SNX)</label>
          <Input
            name="amount"
            ref={register({
              required: true,
              validate: value => Number(value) > 0,
            })}
            disabled={isSubmitting}
          />
          {errors.amount && (
            <InputError>Please enter a valid SNX amount</InputError>
          )}
        </InputGroup>

        <InputGroup>
          <label>Beneficiary Address</label>
          <Input
            name="receiver"
            ref={register({
              required: true,
              validate: value => utils.isAddress(value),
            })}
            disabled={isSubmitting}
          />
          {errors.receiver && (
            <InputError>Please enter a valid address</InputError>
          )}
        </InputGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <ButtonContainer>
          <SecondaryButton as={Link} to="/proposals/">
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" disabled={isSubmitting}>
            Create
          </PrimaryButton>
        </ButtonContainer>
      </Form>
    </>
  )
}

export default CreateProposalPage
