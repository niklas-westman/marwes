# Marwes with Vite

Use this guide when adding Marwes to a Vite React app.

## Install

```bash
pnpm add @marwes-ui/react react react-dom
```

`@marwes-ui/react` loads the default `firstEdition` preset CSS for you, so app code does not need a separate preset CSS import.

## Wrap the app

```tsx
// src/main.tsx
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { MarwesProvider } from "@marwes-ui/react"
import { App } from "./app"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MarwesProvider>
      <App />
    </MarwesProvider>
  </StrictMode>,
)
```

## Build the first screen

```tsx
// src/app.tsx
import { Button, ButtonVariant, Card, H1, InputField, Paragraph } from "@marwes-ui/react"

export function App() {
  return (
    <main className="app-shell">
      <Card title="Project overview" className="app-panel">
        <H1 size="h2">Build with Marwes</H1>
        <Paragraph>
          Marwes gives Vite apps accessible components, theme variables, and beautiful defaults.
        </Paragraph>
        <InputField
          label="Workspace name"
          helperText="Used in navigation and notifications."
          input={{ placeholder: "Acme dashboard" }}
        />
        <Button variant={ButtonVariant.primary}>Create workspace</Button>
      </Card>
    </main>
  )
}
```

```css
/* src/index.css */
html,
body,
#root {
  min-height: 100%;
}

body {
  margin: 0;
}

.app-shell {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: var(--mw-spacing-sp-24);
  color: var(--mw-color-text);
  background: var(--mw-color-background);
}

.app-panel {
  width: min(100%, 34rem);
}
```

## Theme the provider

```tsx
import { MarwesProvider, ThemeMode } from "@marwes-ui/react"

export function Root({ children }: { children: React.ReactNode }) {
  return (
    <MarwesProvider
      theme={{
        mode: ThemeMode.light,
        color: { primary: "#2457ff" },
        ui: { radius: "1rem" },
      }}
    >
      {children}
    </MarwesProvider>
  )
}
```

## Use the same tokens in app CSS

Marwes exposes runtime CSS variables on the provider root. Prefer those variables for app-owned styling so Marwes components and product layout stay visually aligned.

```css
.product-section {
  padding: var(--mw-spacing-sp-32);
  background: var(--mw-color-surface);
  border: 1px solid var(--mw-color-border);
  border-radius: var(--mw-ui-radius);
}
```

## Next steps

- Build a full screen with [Your First Marwes Screen](./your-first-screen.md).
- Copy product patterns from [React Blocks](../blocks/README.md).
- Use [Theme SSR No-Flash Setup](./theme-ssr-no-flash.md) when moving to server rendering.
