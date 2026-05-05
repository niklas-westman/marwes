Vue 3 components for the Marwes design system with default styling, typed theme tokens, accessibility contracts, and AI-readable semantics.

<div align="center">

<img alt="Marwes Design System" src="https://raw.githubusercontent.com/niklas-westman/marwes/main/.github/assets/cover-v3.png" width="100%" style="border-radius: 40px;">

<br>
<br>

# Marwes Design System - Vue

**Vue 3 components with default Marwes styling, typed theme tokens, accessibility contracts, and AI-readable semantics built in.**

Vue 3.4+ • TypeScript-first • Default CSS included • ThemeInput • Google Fonts DX • Purpose components

[Documentation](https://github.com/niklas-westman/marwes/tree/main/docs) • [Storybook](https://d3hobet9plpuvm.cloudfront.net/storybook-react/latest/) • [GitHub](https://github.com/niklas-westman/marwes)

</div>

---

## Why Use It

Marwes gives Vue apps a ready design-system base without requiring custom CSS setup or local component forks.

- **One package for Vue apps**: components, provider, default preset CSS, theme helpers, and typed props.
- **Vue-native binding**: common controls support `v-model` while preserving Marwes semantic contracts.
- **Consequential theming**: a `ThemeInput` object changes colors, fonts, radius, density, typography, and component visuals through shared CSS variables.
- **Purpose components**: `SubmitButton`, `CancelButton`, and `DestructiveButton` make intent machine-readable so tests, audits, and AI agents can handle actions safely.
- **Shared core contracts**: every Vue component is backed by the same framework-agnostic recipes, a11y mapping, and theme shape.

## Package Map

For a Vue app, install this package first. It includes the Vue adapter, loads the default preset CSS, and re-exports the core theme helpers you normally need.

| Package | Use it when |
| --- | --- |
| `@marwes-ui/vue` | You are building a Vue app. |
| `@marwes-ui/react` | You are building a React app instead. |
| `@marwes-ui/core` | You are building adapters, tests, tooling, or framework-agnostic integrations. |
| `@marwes-ui/presets` | You need standalone preset CSS or preset theme exports. |

This split keeps installation simple for app teams while giving humans and AI agents clear package boundaries: adapters render, core defines contracts, presets style.

## Install

```bash
pnpm add @marwes-ui/vue vue
```

No preset CSS import is needed. `@marwes-ui/vue` depends on `@marwes-ui/presets` and loads the default Marwes CSS automatically.

## Quick Start

```vue
<script setup lang="ts">
import { ref } from "vue"
import { Button, ButtonVariant, Checkbox, Input, MarwesProvider, SubmitButton } from "@marwes-ui/vue"

const email = ref("")
const subscribed = ref(false)
</script>

<template>
  <MarwesProvider>
    <Input v-model="email" placeholder="Email" ariaLabel="Email" />
    <Checkbox v-model="subscribed" ariaLabel="Subscribe" />
    <Button :variant="ButtonVariant.secondary">Preview</Button>
    <SubmitButton>Save</SubmitButton>
  </MarwesProvider>
</template>
```

## Style App-Owned UI

Marwes components pick up provider tokens automatically. Your own Vue styling can use the same tokens through scoped CSS, CSS Modules, or `mwThemeVars` in script-driven style objects.

```vue
<script setup lang="ts">
import { Button, ButtonVariant, MarwesProvider, mwThemeVars } from "@marwes-ui/vue"

const panelStyle = {
  padding: mwThemeVars.spacing.sp24,
  background: mwThemeVars.color.surface,
  color: mwThemeVars.color.text,
  borderColor: mwThemeVars.color.border,
}
</script>

<template>
  <MarwesProvider>
    <main class="app-shell">
      <aside class="primary-callout">Launch workspace</aside>
      <section class="feature-panel" :style="panelStyle">
        <Button :variant="ButtonVariant.primary">Save</Button>
      </section>
    </main>
  </MarwesProvider>
</template>

<style scoped>
.app-shell {
  min-height: 100dvh;
  padding: var(--mw-spacing-sp-24);
  color: var(--mw-color-text);
  background: var(--mw-color-background);
}

.feature-panel {
  border: 1px solid var(--mw-color-border);
  border-radius: var(--mw-ui-radius);
}

.primary-callout {
  background: var(--mw-color-primary-base);
  color: var(--mw-color-primary-label);
}
</style>
```

## Use Typed Components

Import components, enum objects, and prop types from the same package. The values line up with the same core recipes and preset CSS.

```vue
<script setup lang="ts">
import {
  BadgeVariant,
  Button,
  ButtonSize,
  ButtonVariant,
  Card,
  H1,
  InputField,
  Paragraph,
  Spacer,
  Spacings,
  StatusBadge,
  SubmitButton,
  type ButtonProps,
  type HeadingProps,
  type InputFieldProps,
  type ParagraphProps,
} from "@marwes-ui/vue"

const primaryAction: ButtonProps = {
  variant: ButtonVariant.primary,
  size: ButtonSize.md,
}

const emailField: InputFieldProps = {
  label: "Email",
  helperText: "Used for project notifications.",
  input: {
    type: "email",
    placeholder: "you@example.com",
  },
}

const titleProps: HeadingProps = {
  size: "h2",
}

const descriptionProps: ParagraphProps = {
  size: "md",
}
</script>

<template>
  <Card>
    <template #title>Project setup</template>
    <StatusBadge :variant="BadgeVariant.success">Ready</StatusBadge>
    <Spacer :spacing="Spacings.sp16" />
    <H1 v-bind="titleProps">Launch workspace</H1>
    <Paragraph v-bind="descriptionProps">
      Components share theme tokens, typed variants, spacing, and semantic metadata.
    </Paragraph>
    <InputField v-bind="emailField" />
    <Spacer :spacing="Spacings.sp24" />
    <Button v-bind="primaryAction">Create project</Button>
    <SubmitButton>Save changes</SubmitButton>
  </Card>
</template>
```

## Available Components

Provider and hooks:
- `MarwesProvider`
- `useTheme`
- `useToast`

Actions and buttons:
- `Button`
- `PrimaryButton`, `SecondaryButton`, `TextButton`, `SuccessButton`
- `SubmitButton`, `CancelButton`, `CreateButton`, `DestructiveButton`
- `LinkButton`, `SaveButton`, `ConfirmButton`, `VerifyButton`
- `EditButton`, `CloseButton`, `RefreshButton`
- `UploadButton`, `DownloadButton`, `CopyButton`
- `SearchButton`, `FilterButton`, `SortButton`, `DropdownButton`

Forms and inputs:
- `Input`, `Textarea`, `Select`, `RichText`, `InputOtp`
- `InputField`, `TextareaField`, `SelectField`, `RichTextField`
- `DropdownField`, `SearchField`, `PasswordField`, `EmailField`
- `DateOfBirthField`, `ZipCodeField`, `PhoneField`, `URLField`, `CurrencyField`
- `Checkbox`, `CheckboxField`, `CheckboxGroupField`
- `Radio`, `RadioGroupField`, `YesNoRadioGroup`, `RatingRadioGroup`, `OptionRadioGroup`
- `Switch`, `SwitchField`, `FeatureToggle`, `PreferenceSwitch`, `PermissionSwitch`
- `Slider`, `SliderField`, `VolumeSlider`, `BrightnessSlider`, `RadiusSlider`

Content and layout:
- `Card`, `ProductCard`, `ProfileCard`, `StatCard`
- `H1`, `H2`, `H3`, `Paragraph`
- `Spacer`, `Spacing`, `Divider`
- `Icon`
- `Avatar`, `AvatarBadge`, `AvatarGroup`, `ProfileAvatar`, `PresenceAvatar`, `TeamAvatarGroup`

Feedback and overlays:
- `Badge`, `BadgeGroup`, `StatusBadge`, `PriorityBadge`, `NotificationBadge`
- `Spinner`, `ButtonSpinner`, `EmptyStateSpinner`
- `Toast`, `ToastContainer`, `ToastProvider`
- `SuccessToast`, `ErrorToast`, `WarningToast`, `InfoToast`
- `Tooltip`, `TooltipGroup`
- `Dialog`, `DialogModal`, `ConfirmDialog`, `DestructiveDialog`, `InfoDialog`
- `Accordion`, `AccordionField`, `FAQAccordion`, `SettingsAccordion`, `SectionsAccordion`
- `Tab`, `TabGroup`, `TabPanel`, `NavigationTabs`, `ContentTabs`, `SettingsTabs`

Typed tokens and helpers:
- `ThemeInput`, `ThemeMode`, `Density`, `ToneName`
- `mwAvailableFonts`, `mwGoogleFontFamilies`, `mwFontFallbacks`, `createFontStack`
- `mwThemeVars`, `mwThemeVarNames`, `mwStyledTheme`, `mwVar`
- `ButtonVariant`, `ButtonSize`, `ButtonAction`
- `BadgeVariant`, `AvatarSize`, `AvatarType`, `SwitchSize`, `IconName`, `Spacings`

## Theme In Seconds

The default Marwes theme is already active. If you already have a good-looking design library or brand system, pass a small typed `ThemeInput` override instead of rebuilding component CSS.

```vue
<script setup lang="ts">
import { MarwesProvider, mwAvailableFonts, type ThemeInput } from "@marwes-ui/vue"

const brandTheme = {
  color: {
    primary: "#2457FF",
    danger: "#D90429",
    success: "#15803D",
    warning: "#D97706",
    background: "#F8FAFC",
    surface: "#FFFFFF",
    surfaceElevated: "#FFFFFF",
    text: "#111827",
    textMuted: "#4B5563",
    border: "#D1D5DB",
    focus: "#2457FF",
  },
  font: {
    primary: mwAvailableFonts.Poppins,
    secondary: mwAvailableFonts.Lora,
  },
  ui: {
    radius: 10,
    density: "comfortable",
  },
} satisfies ThemeInput
</script>

<template>
  <MarwesProvider :theme="brandTheme">
    <AppShell />
  </MarwesProvider>
</template>
```

The provider resolves `ThemeInput` into `--mw-*` CSS variables. Preset CSS consumes those variables across the full component system.

Marwes is designed to look great from the beginning. Start with the default preset, then override only the colors, fonts, radius, or density that belong to your product. Unspecified values keep the polished Marwes defaults.

## Light And Dark Mode

MarwesProvider can own the active mode for the app. Use `ThemeMode.light` and `ThemeMode.dark` instead of string literals, then read or change the active mode with `useThemeMode()` anywhere under the provider. Every component under the provider receives the matching `--mw-*` variables and `mw-theme--light` / `mw-theme--dark` class.

```vue
<script setup lang="ts">
import { Button, ButtonVariant, ThemeMode, useThemeMode } from "@marwes-ui/vue"

const { mode, toggleMode } = useThemeMode()
</script>

<template>
  <Button :variant="ButtonVariant.secondary" @click="toggleMode">
    Use {{ mode === ThemeMode.dark ? ThemeMode.light : ThemeMode.dark }} mode
  </Button>
</template>
```

```vue
<script setup lang="ts">
import { MarwesProvider, ThemeMode } from "@marwes-ui/vue"
import ThemeToggle from "./theme-toggle.vue"
</script>

<template>
  <MarwesProvider :default-mode="ThemeMode.light">
    <ThemeToggle />
    <AppShell />
  </MarwesProvider>
</template>
```

`default-mode` sets the initial uncontrolled mode. `toggleMode()` updates the provider, so Marwes components, preset CSS, and custom app styles that use `--mw-*` variables all move together without duplicating local theme state.

### System And Persisted Preference

`mode` is always the rendered visual mode: `ThemeMode.light` or `ThemeMode.dark`. `preference` is the app or user choice: `ThemeMode.light`, `ThemeMode.dark`, or `"system"`. Use `preference` and `default-preference` when your UI needs a system option; keep using `mode`, `default-mode`, and `on-mode-change` when you only need concrete light/dark compatibility.

```vue
<script setup lang="ts">
import { Button, ButtonVariant, ThemeMode, useThemeMode } from "@marwes-ui/vue"

const { mode, preference, systemMode, isSystem, setPreference, setMode } = useThemeMode()
</script>

<template>
  <p>Rendering {{ mode }}; preference is {{ preference }}; system is {{ systemMode }}.</p>
  <Button :variant="ButtonVariant.secondary" @click="setPreference('system')">
    Use system
  </Button>
  <Button :variant="ButtonVariant.secondary" @click="setMode(ThemeMode.dark)">
    Use dark
  </Button>
  <span v-if="isSystem">Following system</span>
</template>
```

```vue
<script setup lang="ts">
import { MarwesProvider } from "@marwes-ui/vue"
import ThemeMenu from "./theme-menu.vue"
</script>

<template>
  <MarwesProvider default-preference="system" storage-key="marwes-theme" enable-system>
    <ThemeMenu />
    <AppShell />
  </MarwesProvider>
</template>
```

`useThemeMode().mode` never returns `"system"`; it is always the concrete mode Marwes rendered. `useThemeMode().preference` returns the active app/user preference, and `setPreference("system")` is the system-capable setter. `setMode(mode)` remains a concrete light/dark convenience.

`storage-key` is opt-in and defaults to `false`. Storage reads and writes are failure-safe, so private browsing or unavailable storage will fall back to normal provider state. `enable-system` defaults to `true`; set it to `false` to avoid `matchMedia` detection and resolve `"system"` through the light fallback.

This layer does not provide SSR no-flash behavior. Server output can still render the fallback mode before the client applies a stored or system preference. Use it for client-side preference and persistence, not for a no-flash SSR guarantee.

### Root Target Sync

By default Marwes keeps theme state scoped to the provider element. If your app shell also needs the resolved mode on `html` or `body`, set `target` and `attribute`:

```vue
<template>
  <MarwesProvider
    default-preference="system"
    storage-key="marwes-theme"
    target="html"
    attribute="class"
    disable-transition-on-change
  >
    <AppShell />
  </MarwesProvider>
</template>
```

`target` can be `"provider"`, `"html"`, or `"body"`. `attribute` can be `"class"`, `"data-theme"`, or `"data-mode"`. Class mode only adds the active `light` / `dark` class and removes the opposite one; unrelated classes are preserved. The provider root still keeps `mw-theme--light` / `mw-theme--dark` and provider-scoped `--mw-*` variables in every target mode.

Use one global-target provider per app shell. If multiple providers target `html` or `body`, deciding which provider owns that global element is app-owned behavior.

### Tailwind And shadcn Compatibility

Marwes is compatible with Tailwind and shadcn-style dark variants through `target="html" attribute="class"`. App-owned Tailwind tokens can also reference Marwes `--mw-*` variables when rendered inside the provider subtree.

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

Read the [Tailwind and shadcn integration guide](https://github.com/niklas-westman/marwes/blob/main/docs/guides/tailwind-shadcn-integration.md) for Tailwind v3/v4 examples, token mapping, provider-scoped variable limits, and the SSR no-flash boundary.

### Nuxt SSR

Use `createMarwesThemeStyle()`, `createMarwesThemeScript()`, and `variable-strategy="style-tag"` when a server-rendered app needs the correct light or dark variables before hydration. This is opt-in; normal Vue apps keep inline provider variables by default.

Read the [theme SSR no-flash guide](https://github.com/niklas-westman/marwes/blob/main/docs/guides/theme-ssr-no-flash.md) for Nuxt setup, CSP nonces, hydration warning guidance, custom light/dark themes, and stored/system preference behavior.

For a simple brand pass, override shared values once and let Marwes fill the rest. If your product needs different brand colors in light and dark mode, control `mode` and switch between two small `ThemeInput` override objects:

```vue
<script setup lang="ts">
import { ref } from "vue"
import { MarwesProvider, ThemeMode, type ThemeInput } from "@marwes-ui/vue"
import ThemeToggle from "./theme-toggle.vue"

const mode = ref<ThemeMode>(ThemeMode.light)

const themeByMode = {
  [ThemeMode.light]: {
    color: {
      primary: "#2457FF",
      background: "#F8FAFC",
      surface: "#FFFFFF",
      text: "#111827",
      border: "#D1D5DB",
      focus: "#2457FF",
    },
  },
  [ThemeMode.dark]: {
    color: {
      primary: "#8BA2FF",
      background: "#0B1020",
      surface: "#111827",
      text: "#F8FAFC",
      border: "#334155",
      focus: "#93C5FD",
    },
  },
} satisfies Record<ThemeMode, ThemeInput>

function setMode(nextMode: ThemeMode) {
  mode.value = nextMode
}
</script>

<template>
  <MarwesProvider :mode="mode" :theme="themeByMode[mode]" :on-mode-change="setMode">
    <ThemeToggle />
    <AppShell />
  </MarwesProvider>
</template>
```

Mode-specific defaults fill every omitted token, so each override can stay small. `:theme="{ mode: ThemeMode.dark }"` is still enough for the default dark baseline.

## Custom Styling Tokens

`MarwesProvider` resolves `ThemeInput` into `--mw-*` CSS variables. Marwes components and preset CSS consume those variables automatically. The custom styling token helpers let app-owned Vue styles, script-driven style objects, and build-time config use the same provider-scoped values instead of hard-coding colors, spacing, radius, typography, or duplicated `var(...)` strings.

Vue style blocks and CSS Modules can consume provider variables directly:

```vue
<template>
  <section class="panel">
    <slot />
  </section>
</template>

<style scoped>
.panel {
  padding: var(--mw-spacing-sp-24);
  color: var(--mw-color-text);
  background: var(--mw-color-surface);
  border-radius: var(--mw-ui-radius);
}
</style>
```

For script-driven style objects, composables, renderer bridges, or config files, import the same core helpers through the Vue package:

- `mwThemeVars` is the default styling helper. It returns CSS `var(...)` references for style objects, CSS-in-JS integrations, vanilla-extract, and config files.
- `mwThemeVarNames` returns raw custom property names for assigning provider-scoped overrides in style objects or tooling.
- `mwVar()` wraps custom or advanced `--mw-*` names when the named token object does not cover a specialized case.
- `mwStyledTheme` mirrors `mwThemeVars` as a plain object for shared CSS-in-JS integrations that expect a theme object.

```ts
import { mwStyledTheme, mwThemeVarNames, mwThemeVars, mwVar } from "@marwes-ui/vue"

const panelStyle = {
  padding: mwThemeVars.spacing.sp24,
  color: mwThemeVars.color.text,
  outlineColor: mwVar("--mw-color-focus", "#2457FF"),
}

const focusOverride = {
  [mwThemeVarNames.color.focus]: "#FF00AA",
}

const cssInJsTheme = mwStyledTheme
```

This enables Vue apps to keep scoped CSS, dynamic `:style` bindings, custom layout wrappers, and design-tool integrations visually tied to the same active theme as Marwes components. Changing `MarwesProvider :theme="..."` updates both preset components and app-owned styles.

Keep the APIs separate:
- Use `Spacings.sp24` for Marwes spacing props such as `<Spacer :spacing="Spacings.sp24" />`.
- Use `mwThemeVars.spacing.sp24` for custom CSS values.
- Use `mwThemeVarNames.spacing.sp24` when assigning or inspecting a CSS custom property name.
- Use `useTheme()` when Vue logic needs resolved runtime values such as `"#2457FF"`.

## Vue Binding Conventions

- Text-like controls support `v-model` through `modelValue` and `update:modelValue`.
- Inputs also expose `onValueChange` when callback-style wiring is useful.
- Checkboxes support `v-model` and `onCheckedChange`.

Prefer `v-model` in normal Vue app code unless you specifically need callback-style wiring.

## Google Fonts DX

Most Google Font use cases only need `mwAvailableFonts`; no `fontLoading` prop is needed.

```vue
<script setup lang="ts">
import { MarwesProvider, mwAvailableFonts, type ThemeInput } from "@marwes-ui/vue"

const theme = {
  font: {
    primary: mwAvailableFonts.Poppins,
    secondary: mwAvailableFonts.Lora,
  },
} satisfies ThemeInput
</script>

<template>
  <MarwesProvider :theme="theme">
    <App />
  </MarwesProvider>
</template>
```

For self-hosted or licensed fonts, use `BrandSans`, `BrandSerif`, `BrandMono`, or `createFontStack()`.

## Purpose Components

Prefer purpose components for common actions. They lock UX intent and emit AI-readable metadata, so the component is not just "a button with red styling" but a known action with known risk.

```vue
<script setup lang="ts">
import {
  CancelButton,
  CreateButton,
  DestructiveButton,
  SubmitButton,
} from "@marwes-ui/vue"
</script>

<template>
  <CancelButton>Cancel</CancelButton>
  <CreateButton>Create</CreateButton>
  <SubmitButton>Save</SubmitButton>
  <DestructiveButton>Delete</DestructiveButton>
</template>
```

That matters for agentic workflows. A human, test, or AI agent can inspect the DOM and see that a destructive button requires confirmation before activation:

```html
<button
  data-component="button"
  data-purpose="destructive"
  data-action="delete"
  data-destructive="true"
  data-confirmation-required="true"
>
  Delete
</button>
```

An agent can then follow a safer rule: if `data-confirmation-required="true"`, ask the user before clicking. A test can assert the same behavior without guessing from the label "Delete" or from a red color.

## Why It Is Accessible

Marwes Vue components are accessible because the adapter renders a shared core contract, not because each component hand-rolls ARIA in isolation.

- Core recipes produce typed `a11y` output for roles, labels, described-by wiring, invalid state, disabled state, and semantic metadata.
- Vue components prefer native DOM controls first: `button`, `input`, `select`, `textarea`, `hr`, and standard form wiring.
- Field components connect visible labels, helper text, and errors through `id`, `for`, `aria-describedby`, `aria-invalid`, and polite error announcements.
- Coordinated widgets carry explicit contracts: tabs wire `tablist`/`tab`/`tabpanel`, dialogs own dialog semantics, toasts expose live-region behavior, and purpose buttons expose risk metadata.
- Storybook accessibility smoke checks run through the Storybook a11y addon for the promoted Vue families, and shared contract tests keep Vue aligned with React.

Example:

```vue
<script setup lang="ts">
import { InputField, type InputFieldProps } from "@marwes-ui/vue"

const receiptEmailField = {
  label: "Email",
  helperText: "Used for receipts.",
  error: "Enter a valid email.",
  input: { type: "email", placeholder: "you@example.com" },
} satisfies InputFieldProps
</script>

<template>
  <InputField v-bind="receiptEmailField" />
</template>
```

That contract resolves to DOM wiring like:

```html
<label for="email">Email</label>
<input
  id="email"
  type="email"
  aria-describedby="email-helper email-error"
  aria-invalid="true"
>
<p id="email-helper">Used for receipts.</p>
<p id="email-error" aria-live="polite">Enter a valid email.</p>
```

The important part is that the same label, helper, error, and invalid contract is tested at the shared contract layer and then applied by the Vue adapter.

## Package Boundaries

- `@marwes-ui/core` owns recipes, theme resolution, a11y mapping, and semantic metadata.
- `@marwes-ui/presets` owns default preset CSS.
- `@marwes-ui/vue` owns Vue rendering and provider behavior.

## Scripts

```bash
pnpm --filter @marwes-ui/vue build
pnpm --filter @marwes-ui/vue typecheck
pnpm --filter @marwes-ui/vue test
```

## Related Docs

- [Docs index](https://github.com/niklas-westman/marwes/tree/main/docs)
- [Architecture](https://github.com/niklas-westman/marwes/blob/main/docs/reference/architecture.md)
- [Figma to Marwes](https://github.com/niklas-westman/marwes/blob/main/docs/guides/figma-to-marwes.md)
