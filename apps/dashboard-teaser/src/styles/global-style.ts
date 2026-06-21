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

  [data-dashboard-reduce-motion="true"],
  [data-dashboard-reduce-motion="true"] *,
  [data-dashboard-reduce-motion="true"] *::before,
  [data-dashboard-reduce-motion="true"] *::after {
    animation: none !important;
    scroll-behavior: auto !important;
    transition: none !important;
  }

  [data-dashboard-loose-spacing="true"] {
    letter-spacing: 0.03em;
    word-spacing: 0.06em;
  }

  [data-dashboard-loose-spacing="true"] :where(
    .mw-text,
    .mw-heading,
    .mw-p,
    button,
    input,
    select,
    textarea,
    a,
    p,
    li
  ) {
    letter-spacing: 0.03em !important;
    word-spacing: 0.06em;
  }
`

export { GlobalStyle }
