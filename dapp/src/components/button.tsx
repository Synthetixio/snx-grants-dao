import styled, { css } from "styled-components"

const style = css`
  display: flex;
  align-items: center;
  border-radius: 5px;
  border: 0;
  padding: 0.5rem 2rem;
  cursor: pointer;

  :focus {
    outline: 0;
  }

  :hover {
    text-decoration: none;
  }

  :disabled {
    opacity: 0.5;
    cursor: default;
    pointer-events: none;
  }
`

export const PrimaryButton = styled.button`
  ${style}
  color: #fff;
  background-color: var(--color-3);

  :hover:not(:disabled),
  :focus:not(:disabled) {
    background-color: var(--color-3-dark);
  }
`

export const SecondaryButton = styled.button`
  ${style}
  color: var(--color-3);
  background-color: transparent;
  border: 1px solid var(--color-3);

  :hover:not(:disabled),
  :focus:not(:disabled) {
    color: #fff;
    background-color: var(--color-3);
  }
`
