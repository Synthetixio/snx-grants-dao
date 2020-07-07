import React, { useCallback } from "react"
import { Link } from "gatsby"
import styled from "styled-components"

import SEO from "../../components/seo"

const CreateProposalPage = () => {
  const handleSubmit = useCallback(event => {
    event.preventDefault()
    // TODO
  }, [])

  return (
    <>
      <SEO title="Create proposal" />
      <h2>Create Proposal</h2>
      <Form onSubmit={handleSubmit}>
        <Input name="description" placeholder="Description" />
        <Input name="link" placeholder="Link" />
        <Input name="amount" placeholder="Tribute Amount (SNX)" />
        <Input name="receiver" placeholder="Beneficiary Address" />
        <Button type="submit">Create</Button>
      </Form>
      <Link to="/">Go back to the homepage</Link>
    </>
  )
}

const Input = styled.input`
  border: 1px solid var(--color-4);
  padding: 1rem;
`

const Button = styled.button`
  padding: 1rem;
  border: 1px solid var(--color-2);
  cursor: pointer;

  &[type="submit"] {
    background: var(--color-3);
    border-color: var(--color-4);
    color: var(--color-4);
  }
`

const Form = styled.form`
  display: grid;
  grid-gap: 2rem;

  margin: 2rem 0;

  max-width: 75%;

  ${Input} {
  }
`

export default CreateProposalPage
