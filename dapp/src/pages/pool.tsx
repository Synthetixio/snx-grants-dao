import React, { useState, useCallback, useEffect } from "react"
import { PageProps, Link } from "gatsby"
import styled from "styled-components"
import { useForm } from "react-hook-form"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { utils } from "ethers"

import SEO from "../components/seo"
import {
  Section,
  ErrorMessage,
  Title,
  Input,
  InputError,
  Form,
  InputGroup,
  ButtonContainer,
} from "../components/common"
import { useTxToast } from "../components/toast"
import { useGrantsDaoContract } from "../utils/contracts/grantsDaoContract"
import { PrimaryButton, SecondaryButton } from "../components/button"
import { useTotalBalance } from "../utils/hooks"

const PoolPage: React.FC<PageProps> = () => {
  const { register, handleSubmit, errors, formState, reset } = useForm()
  const { addTxToast } = useTxToast()
  const [error, setError] = useState()
  const grantsDaoContract = useGrantsDaoContract()
  const totalBalance = useTotalBalance()

  const onSubmit = useCallback(
    async values => {
      try {
        setError(null)

        const tx = await grantsDaoContract.withdraw(
          values.receiver,
          utils.parseEther(values.amount)
        )

        addTxToast({
          title: "Withdraw SNX",
          description: `Total ${values.amount} SNX`,
          txHash: tx.hash,
        })

        reset()
      } catch (error) {
        console.error(error)
        setError(error.message || error)
      }
    },
    [grantsDaoContract]
  )

  const { isSubmitting } = formState

  return (
    <>
      <SEO title="Pool" />

      <Title>
        <Link to="/proposals/">
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
        Pool
      </Title>

      <BalanceContainer>
        <Section>Total SNX</Section>
        <span>{totalBalance}</span>
      </BalanceContainer>

      <Section>Withdraw SNX</Section>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup>
          <label>Receiver Address</label>
          <Input
            name="receiver"
            ref={register({
              required: true,
              validate: value => utils.isAddress(value),
            })}
            disabled={isSubmitting}
            autoFocus
          />
          {errors.receiver && (
            <InputError>Please enter a valid address</InputError>
          )}
        </InputGroup>

        <InputGroup>
          <label>Amount</label>
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

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <ButtonContainer>
          <SecondaryButton onClick={() => reset()} disabled={isSubmitting}>
            Reset
          </SecondaryButton>
          <PrimaryButton type="submit" disabled={isSubmitting}>
            Confirm
          </PrimaryButton>
        </ButtonContainer>
      </Form>
    </>
  )
}

const BalanceContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;

  ${Section} {
    margin-top: 0;
  }

  span {
    font-size: 3rem;
    font-weight: 900;
    color: var(--color-3);
  }
`

export default PoolPage
