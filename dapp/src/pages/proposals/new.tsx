import React, { useCallback, useState } from "react"
import { Link, navigate } from "gatsby"
import styled from "styled-components"
import { useForm } from "react-hook-form"
import { useWeb3React } from "@web3-react/core"
import SEO from "../../components/seo"
import { Title } from "../../components/common"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { Contract, utils } from "ethers"
import { PrimaryButton, SecondaryButton } from "../../components/button"
import grantsDaoContract from "../../utils/grantsDaoContract"
import { useTxToast } from "../../components/toast"

const CreateProposalPage = () => {
  const [error, setError] = useState("")
  const { register, handleSubmit, errors, formState } = useForm()
  const { chainId, library } = useWeb3React()
  const { addTxToast } = useTxToast()

  const onSubmit = useCallback(
    async values => {
      try {
        const GrantsDAOContract = new Contract(
          grantsDaoContract.addresses[chainId],
          grantsDaoContract.abi,
          library.getSigner()
        )

        const tx = await GrantsDAOContract.createProposal(
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
    [library, chainId]
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
          {errors.description && <p>Please enter a description</p>}
        </InputGroup>

        <InputGroup>
          <label>Link</label>
          <Input
            name="link"
            ref={register({ required: true })}
            disabled={isSubmitting}
          />
          {errors.link && <p>Please enter the proposal's document URL</p>}
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
          {errors.amount && <p>Please enter a valid SNX amount</p>}
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
          {errors.receiver && <p>Please enter a valid address</p>}
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

const InputGroup = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 11rem auto;
  grid-template-rows: auto auto;

  label {
    grid-column: 1;
    grid-row: 1;
    font-size: 0.75rem;
    text-transform: uppercase;
  }

  input {
    grid-column: 2;
    grid-row: 1;
  }

  p {
    grid-column: 2;
    grid-row: 2;
    font-size: 0.75rem;
    color: var(--color-7);
    margin: 0.75rem 0 0 0;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;

  > * {
    margin-left: 1.5rem;
  }
`

const Input = styled.input`
  padding: 1rem;
  border: 1px solid transparent;
  border-radius: 8px;
  box-shadow: 1px 2px 10px rgba(212, 212, 211, 0.59);

  :focus,
  :active {
    border: 1px solid var(--color-3);
    outline: 0;
  }
`

const ErrorMessage = styled.div`
  color: var(--color-7);
  text-align: center;
  border: 1px solid var(--color-7);
  border-radius: 8px;
  background-color: #fff;
  padding: 1rem;
`

const Form = styled.form`
  display: grid;
  grid-gap: 2rem;

  margin: 2rem 0;
`

export default CreateProposalPage
