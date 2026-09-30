# Consumer troubleshooting

Run diagnostics from the consumer app root before changing package internals:

```bash
pnpm dlx @marwes-ui/cli doctor --run-build
```

## Components render without Marwes styling

1. Confirm components are imported from one adapter root, such as `@marwes-ui/react`.
2. Confirm the rendered app is below that adapter's `MarwesProvider`.
3. Remove any direct `@marwes-ui/presets` stylesheet import. The adapter already includes the default preset CSS.
4. Inspect the provider element and confirm it contains `--mw-*` custom properties.

If the provider is present but the component is outside its DOM subtree, move the provider to the application root.

## The provider is at the wrong level

`MarwesProvider` must wrap every Marwes component and any app-owned CSS that evaluates `mwThemeVars`. In an SSR application, render it inside the document body and keep the no-flash style/script helpers in the document head. Follow [Theme SSR no-flash setup](./theme-ssr-no-flash.md).

## An import does not exist

Import consumer APIs from the selected adapter root. Raw input, checkbox, radio, switch, slider, accordion, pagination, segmented-control, and date-picker atoms are internal.

Examples:

```ts
import { InputField, CheckboxField, PaginationField } from "@marwes-ui/react"
```

Do not use adapter source paths, another framework's adapter, or a private component subpath. Check the [component catalog](https://marwes.io/docs/components/) or [`public-api.json`](https://marwes.io/ai/v1/public-api.json) for the exact export.

## Theme values are empty in JavaScript

`mwTheme`, `mwThemeVars`, and values read through a CSS-in-JS `props.theme` bridge contain CSS references such as `var(--mw-color-primary-base)`. They are intended for CSS evaluation below the provider and are not resolved JavaScript values. Reading those references against `:root` can return an empty value because Marwes defines them on the provider element.

Use the adapter's `useTheme()` API for charts, runtime aliases, calculations, or bridges that need concrete values:

```tsx
import { useTheme } from "@marwes-ui/react"

const theme = useTheme()
const primary = theme.color.primary
```

## Light or dark mode flashes during SSR

Use all three parts of the no-flash contract:

1. Emit the Marwes theme style in the document head.
2. Run the Marwes theme script before hydration.
3. Set the provider's variable strategy to `style-tag`.

The script, style, and provider must use the same storage key, default preference, target, and attribute. See [Theme SSR no-flash setup](./theme-ssr-no-flash.md) for Next.js, Nuxt, and SvelteKit examples.

## CSP blocks theme setup or fonts

Pass the request nonce to every inline theme style and script entry. The generated theme script is deterministic and does not use `eval`.

The default preset includes the packaged default font. When a theme selects a remote font, allow that font's stylesheet and file origins in `style-src` and `font-src`, or supply a self-hosted font stack instead. Check browser CSP console messages before broadening a policy.

## Peer dependency warnings

Check [Consumer compatibility](../reference/compatibility.md), then align the app's React, Vue, or Svelte version with the selected adapter's `peerDependencies`. Do not silence incompatible peer warnings with a forced install and assume runtime compatibility.

## `marwes init` reports partial setup

When `init` prints `manual-action-required`, exit code `2` means provider wiring still needs attention. Read the listed files that were inspected, apply the complete framework-specific provider example printed by the CLI, and rerun:

```bash
pnpm dlx @marwes-ui/cli doctor --run-build
```

An installation, typecheck, or build failure preserves the underlying non-zero error code, which can also be `2`. Read the printed failure status rather than treating every exit code `2` as successful installation. `doctor --run-build` runs typecheck when present and then requires a production build; a missing build script is a failure.
