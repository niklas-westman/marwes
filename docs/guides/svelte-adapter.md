# Svelte Adapter Guide

`@marwes-ui/svelte` is a native Svelte 5 adapter built on top of `@marwes-ui/core` recipes.

## Installation

```bash
pnpm add @marwes-ui/svelte
```

## Setup

Import components from the Svelte adapter. The package entry imports the default
firstEdition preset CSS, matching the shared adapter package policy:

```svelte
<!-- +layout.svelte or app entry -->
<script>
  import { MarwesProvider } from "@marwes-ui/svelte"
</script>

<MarwesProvider>
  <slot />
</MarwesProvider>
```

Install `@marwes-ui/presets` directly only when you need standalone preset CSS
or preset exports outside the adapter package.

## Quick Start

```svelte
<script>
  import { Button, InputField } from "@marwes-ui/svelte"
  let name = $state("")
</script>

<InputField label="Your name" input={{ placeholder: "Jane Doe" }} bind:value={name} />
<Button variant="primary" onclick={() => alert(`Hello ${name}`)}>Greet</Button>
```

## Svelte Syntax Notes

### Two-way binding

Svelte uses `bind:value` for form controls instead of `value` + `onValueChange`:

```svelte
<Input bind:value={name} />
<InputField label="Name" input={{}} bind:value={name} />
<Checkbox bind:checked={accepted} />
<Slider bind:value={volume} />
```

### Event naming

Svelte uses lowercase event names matching native DOM conventions:

| React | Svelte |
|-------|--------|
| `onClick` | `onclick` |
| `onValueChange` | `onvaluechange` |
| `onCheckedChange` | `oncheckedchange` |
| `onChange` | `onchange` |

### Children

Svelte uses snippets and content projection for component content:

```svelte
<Button>Click me</Button>
<Card title="Title">Body content</Card>
```

For composed children (e.g., radios inside RadioGroupField), use Svelte's content projection:

```svelte
<RadioGroupField label="Choose">
  <label>
    <Radio name="opt" value="a" />
    <span>Option A</span>
  </label>
</RadioGroupField>
```

### Generated IDs

Svelte uses `$props.id()` for SSR-safe unique ID generation (equivalent to React's `useId()`).

## Theme Configuration

```svelte
<script>
  import { MarwesProvider } from "@marwes-ui/svelte"
</script>

<MarwesProvider theme={{ mode: "dark" }}>
  <slot />
</MarwesProvider>
```

Access theme in components:

```svelte
<script>
  import { useTheme, useThemeMode } from "@marwes-ui/svelte"
  const theme = useTheme()
  const { mode, toggleMode } = useThemeMode()
</script>
```

## SSR

For SvelteKit SSR, use the SSR helpers:

```ts
import { createMarwesThemeScript, createMarwesThemeStyle } from "@marwes-ui/svelte/ssr"
```

## Architecture

The adapter follows the same pattern as the other framework adapters:

```
@marwes-ui/core (recipes, a11y, types)
       ↓
@marwes-ui/presets (CSS)
       ↓
@marwes-ui/react / @marwes-ui/vue / @marwes-ui/svelte
```

Components call core recipes and spread the output onto native elements. No behavior logic is duplicated in the adapter.

## What's Not in Scope

- **Web Components** — not a goal
- **SvelteKit-only features** — no `$app/*` imports in package code
- **Adapter-only behavior forks** — Svelte syntax can differ, but Marwes behavior and public roles stay aligned across framework adapters
