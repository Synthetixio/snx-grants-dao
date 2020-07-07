import React, { useMemo } from "react"
import styled, { createGlobalStyle } from "styled-components"

import "./layout.css"

import Header from "./header"
import Footer from "./footer"

const Layout = ({ children }) => {
  const currentYear = useMemo(() => new Date().getFullYear(), [])

  return (
    <Page>
      <Header />
      <Content>{children}</Content>
      <Footer>© {currentYear} Synthetix</Footer>
      <GlobalStyle />
    </Page>
  )
}

const GlobalStyle = createGlobalStyle`
  html {
    font-family: sans-serif;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
  }

  body {
    margin: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-y: scroll;
    background: var(--color-4);
  }
  
  a {
    color: var(--color-5);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`

const Page = styled.main`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  margin: 0 auto;
  padding: 0 1.0875rem 1.45rem;
  width: 100%;
  max-width: 1024px;
  flex: 1;
`

export default Layout
