# Theme SSR No-Flash Setup

Use this guide when a server-rendered Marwes app needs the correct light or dark variables before React or Vue hydrates.

Normal Marwes apps do not need this setup. The default provider strategy is still `variableStrategy="inline"`, which keeps the resolved `--mw-*` variables directly on the provider root.

## Why This Exists

Root class sync is not enough for Marwes SSR by itself.

Marwes variables are provider-scoped. If the server renders light inline variables and a small script sets `html.dark` before hydration, the provider can still carry light `--mw-*` values until React or Vue updates it.

The no-flash setup uses a different delivery strategy:

- `MarwesThemeStyle` or `createMarwesThemeStyle()` emits light and dark CSS variable rules.
- `MarwesThemeScript` or `createMarwesThemeScript()` runs before hydration and resolves stored or system preference.
- `variableStrategy="style-tag"` stops the provider from emitting inline variables that would block those generated rules.

For document-head scripts, prefer `target="html" attribute="class"`. The `html` element already exists while the head is parsed, so the script can set the mode before provider markup is encountered. A `body` target can only work before paint if your framework places the script after the opening `<body>` tag.

## React And Next.js App Router

```tsx
// app/layout.tsx
import { MarwesProvider } from "@marwes-ui/react"
import { MarwesThemeScript, MarwesThemeStyle } from "@marwes-ui/react/ssr"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = undefined // Replace with your CSP nonce when your app sets one.

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <MarwesThemeStyle nonce={nonce} target="html" attribute="class" />
        <MarwesThemeScript
          nonce={nonce}
          storageKey="marwes-theme"
          defaultPreference="system"
          target="html"
          attribute="class"
        />
      </head>
      <body>
        <MarwesProvider
          defaultPreference="system"
          storageKey="marwes-theme"
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

Put `suppressHydrationWarning` on `<html>`. The pre-hydration script can set `html.light` or `html.dark` before React hydrates, which is expected.

## Vue And Nuxt

```vue
<script setup lang="ts">
import { MarwesProvider } from "@marwes-ui/vue"
import { createMarwesThemeScript, createMarwesThemeStyle } from "@marwes-ui/vue/ssr"

const nonce = undefined // Replace with your CSP nonce when your app sets one.

useHead({
  htmlAttrs: {
    "data-allow-mismatch": "class",
  },
  style: [
    {
      key: "marwes-theme-style",
      innerHTML: createMarwesThemeStyle({ target: "html", attribute: "class" }),
      nonce,
    },
  ],
  script: [
    {
      key: "marwes-theme-script",
      innerHTML: createMarwesThemeScript({
        storageKey: "marwes-theme",
        defaultPreference: "system",
        target: "html",
        attribute: "class",
      }),
      nonce,
    },
  ],
})
</script>

<template>
  <MarwesProvider
    default-preference="system"
    storage-key="marwes-theme"
    target="html"
    attribute="class"
    variable-strategy="style-tag"
  >
    <AppShell />
  </MarwesProvider>
</template>
```

Vue 3.5+ supports `data-allow-mismatch` for expected hydration differences. Use `data-allow-mismatch="class"` on `<html>` when Nuxt reports an expected root class mismatch from the pre-hydration script.

## Custom Light And Dark Themes

Pass matching light and dark theme inputs to the style helper when your brand tokens differ by mode:

```tsx
<MarwesThemeStyle
  target="html"
  attribute="class"
  lightTheme={{ color: { primary: "#2457FF" } }}
  darkTheme={{ color: { primary: "#8BA2FF", background: "#0B1020", text: "#F8FAFC" } }}
/>
```

Vue/Nuxt uses the same options:

```ts
createMarwesThemeStyle({
  target: "html",
  attribute: "class",
  lightTheme: { color: { primary: "#2457FF" } },
  darkTheme: { color: { primary: "#8BA2FF", background: "#0B1020", text: "#F8FAFC" } },
})
```

Each input is resolved through Marwes defaults, so you only need to provide the tokens your app owns.

## CSP

The React helpers accept a `nonce` prop:

```tsx
<MarwesThemeStyle nonce={nonce} />
<MarwesThemeScript nonce={nonce} />
```

The Vue helpers return strings for framework head APIs. Pass the nonce through the head entry your framework renders:

```ts
{
  innerHTML: createMarwesThemeScript({ storageKey: "marwes-theme" }),
  nonce,
}
```

The script is deterministic and does not use `eval`.

## Stored And System Preference Behavior

Stored preferences are read from `localStorage` when `storageKey` is set. A stored `"dark"` preference can render dark variables before hydration when the style helper, script helper, and `variableStrategy="style-tag"` are used together.

`defaultPreference="system"` resolves in the browser with `matchMedia("(prefers-color-scheme: dark)")`. If the script cannot run, the server markup falls back to the provider default until hydration.

## Checklist

Use all of these together for SSR no-flash behavior:

- Add `MarwesThemeStyle` or `createMarwesThemeStyle()` in the document head.
- Add `MarwesThemeScript` or `createMarwesThemeScript()` before hydration.
- Set `variableStrategy="style-tag"` or `variable-strategy="style-tag"` on `MarwesProvider`.
- Use the same `storageKey`, `defaultPreference`, `target`, and `attribute` between the script and provider.
- Prefer `target="html" attribute="class"` when the script runs in the document head.
- Add `suppressHydrationWarning` to `<html>` for React/Next-style hydration.
- Add `data-allow-mismatch="class"` to `<html>` for Vue/Nuxt root class mismatches.
- Pass CSP nonces to inline style/script entries when your app uses nonce-based CSP.
