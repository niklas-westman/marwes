import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
  }

  html, body {
    height: 100%;
  }

  body {
    font-family: ${({ theme }) => theme.font.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: ${({ theme }) => theme.color.background};
    color: ${({ theme }) => theme.color.text};
    transition: background 0.2s, color 0.2s;
  }

  #root {
    min-height: 100%;
  }
`

export { GlobalStyle }
