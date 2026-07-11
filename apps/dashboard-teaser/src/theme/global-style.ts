import { createGlobalStyle } from "styled-components"

// theme.font.primary returns `var(--mw-font-primary)`. That CSS variable is
// defined inside MarwesProvider, which lives below <body>. Outside the provider
// the var resolves to nothing, so fall back to the Marwes default stack: the
// same stack Marwes core ships as theme default.
const marwesFontStack = "'Instrument Sans', Inter, system-ui, sans-serif"

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
  }

  html, body {
    height: 100%;
  }

  html, body {
    font-family: var(--mw-font-primary, ${marwesFontStack});
  }

  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: ${({ theme }) => theme.color.background};
    color: ${({ theme }) => theme.color.text};
    transition: background 0.2s, color 0.2s;
  }

  /* Scroll-triggered fade-up for major sections. */
  [data-reveal="pending"] {
    opacity: 0;
    transform: translateY(12px);
    will-change: opacity, transform;
  }

  [data-reveal="in"] {
    opacity: 1;
    transform: none;
    transition: opacity 520ms ease-out, transform 520ms ease-out;
  }

  @media (prefers-reduced-motion: reduce) {
    [data-reveal] {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
    }
  }

  /* Browsers reset font on form controls; pull the Marwes font through. */
  button, input, select, textarea, optgroup {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
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

  [data-dashboard-reduce-motion="true"] [data-reveal] {
    opacity: 1 !important;
    transform: none !important;
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
