import React from "react"
import styled, { css } from "styled-components"
import { inVotingPeriod } from "../utils"
import GithubMark from "../assets/svgs/github-mark.svg"

type PillProps = {
  size: "sm" | "md"
}

export const Pill = styled.div<PillProps>`
  font-size: 0.75rem;
  font-weight: 400;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 9999px;
  color: var(--color-1);
  background-color: var(--color-6);
  ${props =>
    props.size === "sm" &&
    css`
      font-size: 0.75rem;
      width: 20px;
      height: 20px;
    `}
  ${props =>
    props.size === "md" &&
    css`
      font-size: 1.125rem;
      width: 24px;
      height: 24px;
    `}
    p {
    margin-left: 2px;
  }
`

export const Section = styled.h3`
  display: flex;
  font-size: 1rem;
  text-transform: uppercase;
  margin-top: 40px;
  align-items: center;

  ${Pill} {
    margin-left: 0.625rem;
  }

  .right {
    flex: 1;
    text-align: right;
  }
`

export const Badge = styled.div`
  text-transform: uppercase;
  text-align: center;
  white-space: nowrap;
  border-radius: 10px;
  padding: 0.3125rem 0.625rem;
`
export const InfoBadge = styled(Badge)`
  color: var(--color-3);
  background-color: var(--color-4);
`

export const InvertedInfoBadge = styled(Badge)`
  color: #fff;
  background-color: var(--color-3);
`

export const PrimaryBadge = styled(Badge)`
  color: #fff;
  background-color: var(--color-5);
`

export const DangerBadge = styled(Badge)`
  color: #fff;
  background-color: var(--color-7);
`
export const Text = styled.span`
  font-family: Montserrat, sans-serif;
`

export const proposalStatusToBadge = (proposal, systemInfo) => {
  if (proposal.status === "COMPLETED") {
    return <PrimaryBadge>Completed</PrimaryBadge>
  }

  if (proposal.status === "REJECTED") {
    return <DangerBadge>Rejected</DangerBadge>
  }

  if (proposal.status === "PROPOSED" || proposal.status === "APPROVED") {
    return inVotingPeriod(
      proposal.createdAt,
      systemInfo.votingPhaseDuration
    ) ? (
      <InfoBadge>In Voting</InfoBadge>
    ) : (
      <DangerBadge>Expired</DangerBadge>
    )
  }

  return null
}

export const requestStatusToBadge = status => {
  if (status === "proposed") {
    return <InfoBadge>Proposed</InfoBadge>
  }

  if (status === "completed") {
    return <PrimaryBadge>Completed</PrimaryBadge>
  }

  if (status === "deprecated") {
    return <DangerBadge>Deprecated</DangerBadge>
  }

  return null
}

export const IconLinkWrapper = styled.div`
  display: flex;
  align-items: center;

  svg {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
  }

  a {
    text-decoration: underline;
  }
`
export const GithubLink = ({ text, href }) => {
  return (
    <IconLinkWrapper>
      <GithubMark />
      <a href={href} target="blank">
        {text}
      </a>
    </IconLinkWrapper>
  )
}

export const Wrapper = styled.section``

export const Title = styled.h2`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 1rem;
  text-transform: uppercase;
  height: 2rem;
  margin: 2.25rem 0;

  a svg {
    font-size: 1.5rem;
    color: var(--color-1);
    margin-right: 0.625rem;
    opacity: 0.5;

    :hover {
      opacity: 0.7;
    }
  }

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`

export const Content = styled.div`
  display: flex;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0px 0px 15px -4px rgba(212, 212, 212, 1);
  background-color: #fff;
  padding: 2rem;
  box-sizing: border-box;
  letter-spacing: normal;
`

export const Document = styled.article.attrs(props => ({
  className: `${props.className} markdown-body`,
}))`
  font-family: Montserrat, sans-serif;
  font-size: 0.8rem;
  width: 70%;
`

export const PanelItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 0.75rem;

  > :not(:last-child) {
    margin-bottom: 0.5rem;
  }

  label {
    font-family: Montserrat;
    font-weight: 700;
  }
`

export const PanelItemInfo = styled(PanelItem)`
  background-color: var(--color-4);
  padding: 0.75rem;
  border-radius: 10px;
`

export const DetailPanel = styled.div`
  width: 30%;
  position: sticky;
  top: 0;
  align-self: flex-start;
  padding-right: 1.5rem;

  ${PanelItem}, ${PanelItemInfo} {
    margin-top: 1rem;
  }
`

export const PanelItemContainer = styled.div`
  display: flex;

  ${PanelItem} {
    flex: 1;
  }
`

export const ErrorMessage = styled.div`
  color: var(--color-7);
  text-align: center;
  border: 1px solid var(--color-7);
  border-radius: 8px;
  background-color: #fff;
  padding: 1rem;
`

export const Input = styled.input`
  padding: 1rem;
  border: 1px solid transparent;
  border-radius: 8px;
  box-shadow: 1px 2px 10px rgba(212, 212, 211, 0.59);

  :focus,
  :active {
    border: 1px solid var(--color-3);
    outline: 0;
  }

  ::placeholder {
    font-size: 0.8rem;
    text-transform: uppercase;
    opacity: 0.7;
  }

  :disabled {
    background-color: var(--color-4);
    opacity: 0.7;
  }
`

export const InputError = styled.span`
  font-size: 0.75rem;
  color: var(--color-7);
`

export const InputGroup = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 11rem auto;
  grid-template-rows: auto auto;
  grid-row-gap: 0.75rem;

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

  ${InputError} {
    grid-column: 2;
    grid-row: 2;
  }
`

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;

  > * {
    margin-left: 1.5rem;
  }
`

export const Form = styled.form`
  display: grid;
  grid-gap: 2rem;

  margin: 2rem 0;
`
