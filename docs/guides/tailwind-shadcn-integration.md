# Tailwind and shadcn Integration

Marwes can work beside Tailwind and shadcn-style app shells without requiring a Tailwind plugin.

Use this guide when an app already uses Tailwind utilities, shadcn components, or `dark:` variants and you want Marwes theme mode to stay aligned with that app shell.

## Root Dark Variant Integration

Tailwind and shadcn dark variants usually look for a `dark` class on the root element. Use `target="html" attribute="class"` when you want Marwes to keep that root class aligned with the resolved Marwes mode.

React:

```tsx
<MarwesProvider
  defaultPreference="system"
  storageKey="marwes-theme"
  target="html"
  attribute="class"
>
  <AppShell />
</MarwesProvider>
```

Vue:

```vue
<template>
  <MarwesProvider
    default-preference="system"
    storage-key="marwes-theme"
    target="html"
    attribute="class"
  >
    <AppShell />
  </MarwesProvider>
</template>
```

This controls Tailwind and shadcn `dark:` variants by syncing `html.light` / `html.dark`. It does not move Marwes variables to `:root`.

## Tailwind v3

Configure class-based dark mode, then map app-owned Tailwind tokens to Marwes provider variables.

React content paths:

```ts
import type { Config } from "tailwindcss"

export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--mw-color-background)",
        foreground: "var(--mw-color-text)",
        card: "var(--mw-color-surface)",
        border: "var(--mw-color-border)",
        ring: "var(--mw-color-focus)",
        primary: {
          DEFAULT: "var(--mw-color-primary-base)",
          foreground: "var(--mw-color-primary-label)",
        },
      },
      borderRadius: {
        md: "var(--mw-ui-radius)",
      },
      spacing: {
        "mw-24": "var(--mw-spacing-sp-24)",
      },
    },
  },
} satisfies Config
```

Vue content paths:

```ts
import type { Config } from "tailwindcss"

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{vue,ts}"],
  theme: {
    extend: {
      colors: {
        background: "var(--mw-color-background)",
        foreground: "var(--mw-color-text)",
        card: "var(--mw-color-surface)",
        border: "var(--mw-color-border)",
        ring: "var(--mw-color-focus)",
        primary: {
          DEFAULT: "var(--mw-color-primary-base)",
          foreground: "var(--mw-color-primary-label)",
        },
      },
      borderRadius: {
        md: "var(--mw-ui-radius)",
      },
      spacing: {
        "mw-24": "var(--mw-spacing-sp-24)",
      },
    },
  },
} satisfies Config
```

## Tailwind v4

For Tailwind v4, define the root-class dark variant and app-owned tokens in CSS:

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-background: var(--mw-color-background);
  --color-foreground: var(--mw-color-text);
  --color-card: var(--mw-color-surface);
  --color-border: var(--mw-color-border);
  --color-ring: var(--mw-color-focus);
  --color-primary: var(--mw-color-primary-base);
  --color-primary-foreground: var(--mw-color-primary-label);
  --radius-md: var(--mw-ui-radius);
  --spacing-mw-24: var(--mw-spacing-sp-24);
}
```

## Dark Variants Versus Token Mapping

The two integration points are separate:

- `target="html" attribute="class"` controls Tailwind and shadcn `dark:` variants by syncing `html.light` / `html.dark`.
- Tailwind theme tokens that reference `var(--mw-*)` let app-owned Tailwind utilities read the Marwes provider variables.

Marwes variables are provider-scoped. Tailwind utilities that reference `--mw-*` must render inside the `MarwesProvider` subtree, or inside another element where the app has deliberately exposed equivalent variables.

## SSR Boundary

Root class integration is not SSR no-flash support by itself.

Syncing `html.dark` does not update provider inline variables before hydration. A server-rendered page can still show fallback Marwes variables until React or Vue hydrates and applies the resolved provider mode.

Full no-flash SSR support requires separate SSR helpers that can deliver matching light/dark variables before hydration. See the [theme SSR no-flash guide](./theme-ssr-no-flash.md).
