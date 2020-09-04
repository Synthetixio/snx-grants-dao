import React, { useMemo } from "react"
import { Wrapper, Button, Menu, MenuItem } from "react-aria-menubutton"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"

const SimpleDropDown = ({ disabled, items, selectedValue, onValueChange }) => {
  const currentItem = useMemo(
    () => items.find(item => item.value === selectedValue),
    [selectedValue]
  )

  const menuItems = items.map(({ value, label }, i) => {
    return (
      <MenuItem
        key={value}
        tag="li"
        value={value}
        className="AriaMenuButton-menuItem"
      >
        {label}
      </MenuItem>
    )
  })

  const handleSelection = (value, event) => {
    onValueChange(value, event)
  }

  return (
    <StyledMenuWrapper
      onSelection={handleSelection}
      className="simple-drop-down"
    >
      <StyledButton className="AriaMenuButton-trigger" disabled={disabled}>
        {currentItem.label}
        <FontAwesomeIcon icon={faChevronDown} />
      </StyledButton>
      <Menu className="AriaMenuButton-menu">
        <ul>{menuItems}</ul>
      </Menu>
    </StyledMenuWrapper>
  )
}

const StyledMenuWrapper = styled(Wrapper)`
  display: flex;
  position: relative;
  font-size: 0.8rem;

  .AriaMenuButton-trigger {
    :focus {
      outline: 0;
    }
  }

  .AriaMenuButton-menu {
    background: #fff;
    list-style-type: none;
    width: 100%;
    position: absolute;
    z-index: 99;
    top: 45px;
    box-shadow: 0px 21px 14px -11px rgba(0, 0, 0, 0.25);

    ul {
      padding: 0;
      margin: 0;
    }
  }

  .AriaMenuButton-menuItem {
    font-size: 0.8rem;
    font-weight: bold;
    text-transform: uppercase;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    list-style: none;
    cursor: pointer;

    :focus,
    :active,
    :hover {
      background-color: var(--color-6-light);
      outline: 0;
    }
  }
`

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: #fff;
  padding: 0.75rem 1rem;
  border: 1px solid transparent;
  border-radius: 8px;
  box-shadow: 1px 2px 10px rgba(212, 212, 211, 0.59);
  cursor: pointer;

  :focus,
  :active {
    border: 1px solid var(--color-3);
    outline: 0;
  }

  &[aria-disabled="true"] {
    background-color: var(--color-4);
    opacity: 0.7;
    cursor: default;
  }

  &[aria-expanded="true"] {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  svg {
    margin-left: 1rem;
    opacity: 0.5;
  }
`

export default SimpleDropDown
