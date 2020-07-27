import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { Button, Wrapper, Menu, MenuItem } from "react-aria-menubutton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import SynthetixLogo from "../assets/svgs/Synthetix-logo.svg"
import ConnectToWallet from "./connectToWallet"

const Header: React.FC = () => {
  return (
    <Container>
      <Content>
        <h1>
          <StyledLink to="/">
            <SynthetixLogo />
            grants<b>DAO</b>
          </StyledLink>
        </h1>

        <ConnectToWallet />

        <StyledMenuWrapper className="AriaMenuButton">
          <Button className="AriaMenuButton-trigger">
            <FontAwesomeIcon icon={faBars} />
          </Button>
          <Menu className="AriaMenuButton-menu">
            <ul>
              <MenuItem tag="li" className="item">
                <Link to="/proposals/">Proposals</Link>
              </MenuItem>
              <MenuItem tag="li" className="item">
                <Link to="/requests/">Requests</Link>
              </MenuItem>
              <MenuItem tag="li" className="item">
                <Link to="/create-proposal/">Create proposal</Link>
              </MenuItem>
              <MenuItem tag="li" className="item">
                <Link to="/members/">Members</Link>
              </MenuItem>
              <MenuItem tag="li" className="item">
                <Link to="/pool/">Pool</Link>
              </MenuItem>
            </ul>
          </Menu>
        </StyledMenuWrapper>
      </Content>
    </Container>
  )
}

const Container = styled.header`
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

const StyledLink = styled(Link)`
  svg {
    margin-right: 10px;
  }
`

const StyledMenuWrapper = styled(Wrapper)`
  display: inline-block;
  position: relative;

  .AriaMenuButton-trigger {
    cursor: pointer;
    display: inline-block;
    user-select: none;
    font-size: 1.5rem;
    font-weight: bold;
    opacity: 0.5;

    :focus {
      outline: 0;
    }

    :active,
    :hover {
      opacity: 0.7;
    }
  }

  .AriaMenuButton-menu {
    background: #fff;
    list-style-type: none;
    position: absolute;
    top: 100%;
    right: -17px;
    z-index: 99;
    padding-left: 0;
    margin: 14px 0 0 0;
    width: 215px;
    box-shadow: 0px 21px 14px -11px rgba(0, 0, 0, 0.25);
  }

  .item {
    list-style: none;
    font-size: 0.8rem;
    font-weight: bold;
    text-transform: uppercase;
    margin: 1rem 0;

    :focus {
      outline: 0;
    }

    a {
      display: inline-block;
      color: var(--color-1);
      width: 100%;
    }
  }
`

export default Header
