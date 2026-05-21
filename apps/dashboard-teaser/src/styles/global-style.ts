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
    font-family: 'Instrument Sans', system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: var(--mw-color-background, #ffffff);
    color: var(--mw-color-text, #141414);
    transition: background 0.2s, color 0.2s;
  }

  #root {
    min-height: 100%;
  }
`

export { GlobalStyle }
