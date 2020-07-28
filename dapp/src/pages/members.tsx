import React, { useMemo, useContext, useState, useRef } from "react"
import { PageProps, Link } from "gatsby"
import { gql, useQuery } from "@apollo/client"
import styled from "styled-components"
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
} from "../components/common"
import Table from "../components/table"
import Address from "../components/address"
import Loading from "../components/loading"
import { ConfirmationModalContext } from "../components/confirmationModal"
import { useTxToast } from "../components/toast"
import { useGrantsDaoContract } from "../utils/contracts/grantsDaoContract"
import { useAccount } from "../utils/hooks"
import SimpleDropDown from "../components/simpleDropDown"
import { PrimaryButton } from "../components/button"

const MEMBERS_QUERY = gql`
  query MembersPage {
    teamMembers: members(where: { type: TEAM }) {
      id
      type
    }
    communityMembers: members(where: { type: COMMUNITY }) {
      id
      type
    }
  }
`

type MemberType = "TEAM" | "COMMUNITY"

const memberTypes: Array<{ value: MemberType; label: string }> = [
  { value: "TEAM", label: "CORE CONTRIBUTOR" },
  { value: "COMMUNITY", label: "COMMUNITY MEMBER" },
]

const memberTypeLabel = isTeamMember =>
  isTeamMember ? "Core Contributor" : "Community Member"

const MembersPage: React.FC<PageProps> = () => {
  const { data, loading, error: apolloError } = useQuery(MEMBERS_QUERY)
  const { confirmAction } = useContext(ConfirmationModalContext)
  const { addTxToast } = useTxToast()
  const [pendingTx, setPendingTx] = useState(false)
  const [memberTypeValue, setMemberTypeValue] = useState<MemberType>("TEAM")
  const [addressValue, setAddressValue] = useState("")
  const validAddress = useMemo(
    () => (addressValue === "" ? true : utils.isAddress(addressValue)),
    [addressValue]
  )
  const addressRef = useRef(null)
  const [error, setError] = useState()
  const grantsDaoContract = useGrantsDaoContract()
  const { isTeamMember } = useAccount()

  const handleAddMember = async () => {
    if (!addressValue) {
      addressRef.current.focus()
      return
    }

    try {
      setPendingTx(true)
      setError(null)

      const tx = await (memberTypeValue === "TEAM"
        ? grantsDaoContract.addTeamMember(addressValue)
        : grantsDaoContract.addCommunityMember(addressValue))

      addTxToast({
        title: `Add a ${memberTypeLabel(memberTypeValue === "TEAM")}`,
        description: (
          <>
            Member <em>{addressValue}</em> was added
          </>
        ),
        txHash: tx.hash,
      })
    } catch (error) {
      console.error(error)
      setError(error.message || error)
    } finally {
      setPendingTx(false)
    }
  }

  const deleteMember = async (address: string, isTeamMember: boolean) => {
    const memberType = memberTypeLabel(isTeamMember)

    try {
      await confirmAction(
        <>
          You are about to delete a <strong>{memberType}</strong>. Are you sure?
        </>
      )
    } catch (error) {
      console.log("Delete action cancelled")
      return
    }

    try {
      setPendingTx(true)
      setError(null)

      const tx = await (isTeamMember
        ? grantsDaoContract.removeTeamMember(address)
        : grantsDaoContract.removeCommunityMember(address, []))

      addTxToast({
        title: `Delete ${memberType}`,
        description: (
          <>
            Member <em>{address}</em> was deleted
          </>
        ),
        txHash: tx.hash,
      })
    } catch (error) {
      console.error(error)
      setError(error.message || error)
    } finally {
      setPendingTx(false)
    }
  }

  const columns = useMemo(
    () => [
      {
        Header: "Address",
        accessor: "id",
        Cell: ({ value }) => <Address address={value} shortAccount={false} />,
      },
      {
        Header: "",
        id: "actions",
        disableSortBy: true,
        Cell: ({ row: { original } }) =>
          isTeamMember && (
            <DeleteLink>
              <FontAwesomeIcon icon={faTrashAlt} />
              <a
                href="#"
                onClick={() =>
                  deleteMember(original.id, original.type === "TEAM")
                }
              >
                Delete
              </a>
            </DeleteLink>
          ),
      },
    ],
    [grantsDaoContract, isTeamMember]
  )

  if (loading) {
    return <Loading />
  }

  if (apolloError) {
    return <ErrorMessage>{apolloError.message}</ErrorMessage>
  }

  const { teamMembers, communityMembers } = data

  return (
    <>
      <SEO title="Members" />

      <Title>
        <Link to="/proposals/">
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
        Members
      </Title>

      {isTeamMember && (
        <AddMemberContainer>
          <SimpleDropDown
            items={memberTypes}
            selectedValue={memberTypeValue}
            onValueChange={value => setMemberTypeValue(value)}
            disabled={pendingTx}
          />
          <AddressInput
            name="address"
            value={addressValue}
            disabled={pendingTx}
            placeholder="Address"
            onChange={e => setAddressValue(e.target.value)}
            ref={addressRef}
          />
          {!validAddress && (
            <InputError>Please enter a valid address</InputError>
          )}
          <PrimaryButton
            disabled={pendingTx || !validAddress}
            onClick={handleAddMember}
          >
            Add
          </PrimaryButton>
        </AddMemberContainer>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Section>
        Core Contributors{" "}
        <Pill size="sm">
          <p>{teamMembers.length}</p>
        </Pill>
      </Section>

      <Table columns={columns} data={teamMembers} />

      <Section>
        Community Members{" "}
        <Pill size="sm">
          <p>{communityMembers.length}</p>
        </Pill>
      </Section>

      <Table columns={columns} data={communityMembers} />
    </>
  )
}

const AddMemberContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  grid-template-rows: auto auto;
  grid-column-gap: 1rem;
  grid-row-gap: 0.75rem;
  justify-content: start;

  ${InputError} {
    grid-column: 2;
    grid-row: 2;
  }
`

const AddressInput = styled(Input)`
  width: 25rem;
  padding: 0.75rem 1rem;
`

const DeleteLink = styled(IconLinkWrapper)`
  align-items: center;
  justify-content: flex-end;

  svg {
    font-size: 1rem;
    opacity: 0.5;
  }
`

export default MembersPage
