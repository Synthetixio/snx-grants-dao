import React from "react"
import styled from "styled-components"

const Footer: React.FC = ({ children }) => (
  <Wrapper>
    <Content>{children}</Content>
  </Wrapper>
)

const Wrapper = styled.footer`
  padding: 1rem 0;
`

const Content = styled.div`
  margin: 0 auto;
  padding: 1.45rem 1.0875rem;
  max-width: var(--header-width);
  text-align: center;
`

export default Footer
