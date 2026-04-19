# @marwes-ui/vue

Vue 3 adapter for Marwes core recipes.

## Responsibilities

- Provide Vue components and provider APIs
- Resolve theme from Vue context and runtime provider state
- Apply RenderKit output to native elements
- Preserve the core package as the source of truth for behavior and accessibility

## Non-Responsibilities

- No duplication of behavior that belongs in `@marwes-ui/core`
- No ownership of preset CSS
- No adapter-specific visual hacks that should live in presets or core

## Install

```bash
pnpm add @marwes-ui/core @marwes-ui/vue @marwes-ui/presets vue
```

## Quick Start

```vue
<script setup lang="ts">
import { ref } from "vue"
import { Button, Checkbox, Input, MarwesProvider } from "@marwes-ui/vue"
import { firstEditionTheme } from "@marwes-ui/presets"
import "@marwes-ui/presets/firstEdition/styles.css"

const email = ref("")
const subscribed = ref(false)
</script>

<template>
  <MarwesProvider :theme="firstEditionTheme">
    <Button variant="primary">Save</Button>
    <Input v-model="email" placeholder="Email" ariaLabel="Email" />
    <Checkbox v-model="subscribed" ariaLabel="Subscribe" />
  </MarwesProvider>
</template>
```

## Public API Shape

Provider and hooks:

- `MarwesProvider`
- `useTheme`
- `useRenderKitDebug`

Representative component families:

- Buttons and semantic button variants
- Inputs, textareas, selects, rich text, OTP, and field variants
- Checkbox and radio families
- Typography, icons, cards, badges, dividers, spacing
- Toasts, tooltips, dialogs, tabs, accordions, sliders, switches, avatars

Core enums and theme types are re-exported where useful.

For the exact public export list, use `packages/vue/src/index.ts` as the source of truth.

## Vue Binding Conventions

The Vue adapter supports Vue-native bindings while preserving Marwes naming where it adds clarity:

- text-like controls support `v-model` through `modelValue` and `update:modelValue`
- inputs also expose `onValueChange` when you want a callback-style API
- checkboxes support `v-model` and `onCheckedChange`

Prefer `v-model` in normal Vue app code unless you specifically need callback-style wiring.

## Adapter Rules

- Keep wrappers thin
- Let core recipes decide semantics, a11y, and state derivation
- Apply emitted classes, data attributes, and vars without inventing parallel logic
- Import preset CSS explicitly in the consuming app

## Scripts

```bash
pnpm --filter @marwes-ui/vue dev
pnpm --filter @marwes-ui/vue build
pnpm --filter @marwes-ui/vue typecheck
pnpm --filter @marwes-ui/vue test
```

## Related Docs

- [Main README](../../README.md)
- [Presets package README](../presets/README.md)
- [React package README](../react/README.md)
- [Architecture reference](../../docs/reference/architecture.md)
