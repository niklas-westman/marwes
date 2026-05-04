# Marwes with Next.js

Use this guide when adding Marwes to a Next.js App Router project.

## Install

```bash
pnpm add @marwes-ui/react react react-dom
```

`@marwes-ui/react` includes the default Marwes preset CSS.

## Basic App Router setup

```tsx
// app/layout.tsx
import type { ReactNode } from "react"
import { MarwesProvider } from "@marwes-ui/react"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MarwesProvider>{children}</MarwesProvider>
      </body>
    </html>
  )
}
```

```tsx
// app/page.tsx
import { Button, ButtonVariant, Card, H1, Paragraph } from "@marwes-ui/react"

export default function Page() {
  return (
    <main className="page-shell">
      <Card title="Marwes + Next.js">
        <H1 size="h2">Ship a clean first screen</H1>
        <Paragraph>
          Marwes components work in App Router projects with provider-scoped theme variables.
        </Paragraph>
        <Button variant={ButtonVariant.primary}>Open dashboard</Button>
      </Card>
    </main>
  )
}
```

```css
/* app/globals.css */
body {
  margin: 0;
}

.page-shell {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: var(--mw-spacing-sp-24);
  color: var(--mw-color-text);
  background: var(--mw-color-background);
}
```

## No-flash theme setup

For server-rendered light/dark mode, use the SSR helpers so the right variables are available before hydration.

```tsx
// app/layout.tsx
import type { ReactNode } from "react"
import { MarwesProvider } from "@marwes-ui/react"
import { MarwesThemeScript, MarwesThemeStyle } from "@marwes-ui/react/ssr"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <MarwesThemeStyle target="html" attribute="class" />
        <MarwesThemeScript
          storageKey="marwes-theme"
          defaultPreference="system"
          target="html"
          attribute="class"
        />
      </head>
      <body>
        <MarwesProvider
          storageKey="marwes-theme"
          defaultPreference="system"
          target="html"
          attribute="class"
          variableStrategy="style-tag"
        >
          {children}
        </MarwesProvider>
      </body>
    </html>
  )
}
```

Use `variableStrategy="style-tag"` in this setup so provider inline variables do not override the generated light/dark rules before hydration.

## Client components

Interactive controls can live in client components as usual.

```tsx
"use client"

import { useState } from "react"
import { SubmitButton, TextareaField } from "@marwes-ui/react"

export function FeedbackForm() {
  const [message, setMessage] = useState("")

  return (
    <form>
      <TextareaField
        label="Feedback"
        textarea={{ value: message, onChange: (event) => setMessage(event.currentTarget.value) }}
      />
      <SubmitButton>Send feedback</SubmitButton>
    </form>
  )
}
```

## Next steps

- Use [Your First Marwes Screen](./your-first-screen.md) for a complete product page example.
- Copy product patterns from [React Blocks](../blocks/README.md).
- Read [Theme SSR No-Flash Setup](./theme-ssr-no-flash.md) for CSP, storage, and custom theme details.
