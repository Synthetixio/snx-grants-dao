import React from "react"
import styled from "styled-components"

type Props = {
  onClick: () => void
}

const Button: React.FC<Props> = ({ children, ...rest }) => {
  return <StyledButton {...rest}>{children}</StyledButton>
}

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  border-radius: 5px;
  border: 0;
  padding: 0.5rem 0.8rem;
  cursor: pointer;

  :focus {
    outline: 0;
  }
`

export const PrimaryButton = styled(Button)`
  color: #fff;
  background-color: var(--color-3);

  :hover,
  :focus {
    background-color: var(--color-3-dark);
  }
`

export const SecondaryButton = styled(Button)`
  color: var(--color-3);
  background-color: #fff;
  border: 1px solid var(--color-3);

  :hover,
  :focus {
    color: #fff;
    background-color: var(--color-3);
  }
`

export default Button
