# @marwes-ui/svelte

Native Svelte 5 adapter for [Marwes UI](https://github.com/marwes-ui/marwes) — built over `@marwes-ui/core` contracts using Svelte 5 runes and components.

## Installation

```bash
pnpm add @marwes-ui/svelte @marwes-ui/presets
```

## CSS Import

Import preset styles explicitly in your app entry:

```svelte
<script lang="ts">
  import "@marwes-ui/presets/firstEdition/styles.css";
</script>
```

## Quick Start

```svelte
<script lang="ts">
  import { MarwesProvider, Button, Input } from "@marwes-ui/svelte";
  import "@marwes-ui/presets/firstEdition/styles.css";

  let name = $state("");
</script>

<MarwesProvider>
  <Input bind:value={name} placeholder="Enter your name" />
  <Button onclick={() => alert(`Hello ${name}!`)}>Greet</Button>
</MarwesProvider>
```

## Theme Configuration

```svelte
<script lang="ts">
  import { MarwesProvider } from "@marwes-ui/svelte";
  import type { ThemeInput } from "@marwes-ui/svelte";

  const theme: ThemeInput = {
    colors: {
      primary: { h: 210, s: 80, l: 50 }
    }
  };
</script>

<MarwesProvider {theme}>
  <!-- your app -->
</MarwesProvider>
```

## SSR Helpers

```ts
import { createMarwesThemeScript, createMarwesThemeStyle } from "@marwes-ui/svelte/ssr";
```

## Design

- **Not Web Components** — native Svelte 5 components using runes (`$props`, `$state`, `$derived`, `$effect`, `$bindable`).
- **Thin adapter** — all variant logic, a11y contracts, and theme resolution live in `@marwes-ui/core`.
- **Dependency boundary** — `@marwes-ui/svelte` depends only on `@marwes-ui/core` at runtime. Svelte is a peer dependency.
- **CSS ownership** — consumers import CSS from `@marwes-ui/presets` explicitly.
