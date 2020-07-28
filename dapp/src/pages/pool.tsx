import React, {
  useMemo,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react"
import { PageProps, Link } from "gatsby"
import { gql, useQuery } from "@apollo/client"
import styled from "styled-components"
import { useForm } from "react-hook-form"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { utils } from "ethers"

import SEO from "../components/seo"
import {
  Section,
  Pill,
  ErrorMessage,
  Title,
  IconLinkWrapper,
  Input,
  InputError,
  Form,
  InputGroup,
  ButtonContainer,
} from "../components/common"
import Table from "../components/table"
import Address from "../components/address"
import Loading from "../components/loading"
import { ConfirmationModalContext } from "../components/confirmationModal"
import { useTxToast } from "../components/toast"
import { useGrantsDaoContract } from "../utils/contracts/grantsDaoContract"
import { useAccount } from "../utils/hooks"
import SimpleDropDown from "../components/simpleDropDown"
import { PrimaryButton, SecondaryButton } from "../components/button"

const POOL_QUERY = gql`
  query PoolPage {
    systemInfo(id: "current") {
      totalBalance
    }
  }
`

const PoolPage: React.FC<PageProps> = () => {
  const { data, loading, error: apolloError } = useQuery(POOL_QUERY)
  const { register, handleSubmit, errors, formState, reset } = useForm()
  const { addTxToast } = useTxToast()
  const [pendingTx, setPendingTx] = useState(false)
  const [error, setError] = useState()
  const grantsDaoContract = useGrantsDaoContract()

  const onSubmit = useCallback(
    async values => {
      try {
        setPendingTx(true)
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
      } finally {
        setPendingTx(false)
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

      {apolloError && <ErrorMessage>{apolloError.message}</ErrorMessage>}

      <BalanceContainer>
        <Section>Total SNX</Section>
        <span>{data?.systemInfo.totalBalance}</span>
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
          <SecondaryButton onClick={() => reset()}>Reset</SecondaryButton>
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
