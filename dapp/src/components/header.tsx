import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import SynthetixLogo from "../images/Synthetix-logo.svg"

const StyledLink = styled(Link)`
margin-left: 10px;
`;

const Header: React.FC = () => (
  <Wrapper>
    <Content>
      <h1>
        <SynthetixLogo />
        <StyledLink to="/">
          grants<b>DAO</b>
        </StyledLink>
      </h1>

      <Menu>
        <Link to="/proposals/new">Create proposal</Link>
        <Link to="/pool">Pool</Link>
      </Menu>
    </Content>
  </Wrapper>
)

const Wrapper = styled.header`
  margin-bottom: 1.45rem;
  background: #ffffff;
  box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.25);
`

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 1.45rem 1.0875rem;
  width: 100%;
  height: var(--header-height);

  h1 {
    font-size: 1.25rem;
    margin: 0;
  }

  a {
    color: var(--color-3);
    text-decoration: none;
  }
`

const Menu = styled.nav`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  text-align: right;
`

export default Header
