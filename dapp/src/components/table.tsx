import React from "react"
import { useTable, useSortBy } from "react-table"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons"
import { Text } from "./common"

type Props = {
  columns: Array<any>
  data: Array<any>
  initialState?: any
  noDataMessage?: string
}

const Table = ({ columns, data, initialState, noDataMessage }: Props) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      initialState,
    },
    useSortBy
  )

  return data.length === 0 ? (
    <EmptyContent>
      <Text>{noDataMessage || "No records"}</Text>
    </EmptyContent>
  ) : (
    <StyledTable {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render("Header")}
                <span>
                  {" "}
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <FontAwesomeIcon icon={faArrowDown} />
                    ) : (
                      <FontAwesomeIcon icon={faArrowUp} />
                    )
                  ) : (
                    ""
                  )}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </StyledTable>
  )
}

export default Table

const EmptyContent = styled.div`
  font-size: 0.75rem;
  text-align: center;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0px 0px 15px -4px rgba(212, 212, 212, 1);
  background-color: #fff;
  padding: 1rem 1.5rem;
  box-sizing: border-box;
`

const StyledTable = styled.table`
  font-size: 0.75rem;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0px 0px 15px -4px rgba(212, 212, 212, 1);
  border-collapse: collapse;
  background-color: #fff;

  thead tr {
    border-bottom: 2px solid var(--color-6);

    th {
      padding: 0.75rem 1.5rem;
      text-align: left;
      text-transform: uppercase;
      white-space: nowrap;
    }
  }

  tbody {
    letter-spacing: 0.03rem;
    line-height: normal;

    tr {
      :not(:last-child) {
        border-bottom: 1px solid var(--color-6);
      }

      :hover {
        background-color: var(--color-6-light);
      }

      td {
        padding: 0.75rem 1.5rem;
      }
    }
  }
`
export const TitleLink = styled(Text)`
  font-size: 0.85rem;
`
