<div align="center">

<img alt="Marwes Design System" src="https://raw.githubusercontent.com/niklas-westman/marwes/main/.github/assets/banner-light.png" width="100%" style="border-radius: 40px;">

<br>
<br>

# Marwes Design System - React

**React components with default Marwes styling, typed theme tokens, accessibility contracts, and AI-readable semantics built in.**

React 18+ • TypeScript-first • Default CSS included • ThemeInput • Google Fonts DX • Purpose components

[Documentation](https://github.com/niklas-westman/marwes/tree/main/docs) • [Storybook](https://d3hobet9plpuvm.cloudfront.net/storybook-react/latest/) • [GitHub](https://github.com/niklas-westman/marwes)

</div>

---

## Why Use It

Marwes is built for teams and AI-assisted workflows that need a component system that is easy to install, easy to theme, and hard to misuse.

- **One package for React apps**: components, provider, default preset CSS, theme helpers, and typed props.
- **Beautiful defaults**: install the adapter, wrap your app, and start building without a separate CSS setup.
- **Consequential theming**: a `ThemeInput` object changes colors, fonts, radius, density, typography, and component visuals through shared CSS variables.
- **Purpose components**: `SubmitButton`, `CancelButton`, and `DestructiveButton` make intent machine-readable so tests, audits, and AI agents can handle actions safely.
- **Shared core contracts**: every React component is backed by the same framework-agnostic recipes, a11y mapping, and theme shape.

## Package Map

For a React app, install this package first. It includes the React adapter, loads the default preset CSS, and re-exports the core theme helpers you normally need.

| Package | Use it when |
| --- | --- |
| `@marwes-ui/react` | You are building a React app. |
| `@marwes-ui/vue` | You are building a Vue app instead. |
| `@marwes-ui/core` | You are building adapters, tests, tooling, or framework-agnostic integrations. |
| `@marwes-ui/presets` | You need standalone preset CSS or preset theme exports. |

This split keeps installation simple for app teams while giving humans and AI agents clear package boundaries: adapters render, core defines contracts, presets style.

## Install

```bash
pnpm add @marwes-ui/react react react-dom
```

No preset CSS import is needed. `@marwes-ui/react` depends on `@marwes-ui/presets` and loads the default Marwes CSS automatically.

## Quick Start

```tsx
import {
  Button,
  ButtonVariant,
  Checkbox,
  Input,
  MarwesProvider,
  SubmitButton,
} from "@marwes-ui/react"

export function App() {
  return (
    <MarwesProvider>
      <Input placeholder="Email" ariaLabel="Email" />
      <Checkbox ariaLabel="Subscribe" />
      <Button variant={ButtonVariant.secondary}>Preview</Button>
      <SubmitButton>Save</SubmitButton>
    </MarwesProvider>
  )
}
```

## Style App-Owned UI

Marwes components pick up provider tokens automatically. Your own React styling can use the same tokens by importing `mwThemeVars`. This example uses styled-components, but the same values work in Emotion, vanilla-extract, inline style objects, CSS Modules, and plain CSS.

```tsx
import { Button, ButtonVariant, MarwesProvider, mwThemeVars } from "@marwes-ui/react"
import styled from "styled-components"

const AppShell = styled.main`
  min-height: 100dvh;
  padding: ${mwThemeVars.spacing.sp24};
  color: ${mwThemeVars.color.text};
  background: ${mwThemeVars.color.background};
`

const FeaturePanel = styled.section`
  padding: ${mwThemeVars.spacing.sp24};
  background: ${mwThemeVars.color.surface};
  border: 1px solid ${mwThemeVars.color.border};
  border-radius: ${mwThemeVars.ui.radius};
`

const PrimaryCallout = styled.aside`
  background: ${mwThemeVars.color.primary.base};
  color: ${mwThemeVars.color.primary.label};
`

export function App() {
  return (
    <MarwesProvider>
      <AppShell>
        <PrimaryCallout>Launch workspace</PrimaryCallout>
        <FeaturePanel>
          <Button variant={ButtonVariant.primary}>Save</Button>
        </FeaturePanel>
      </AppShell>
    </MarwesProvider>
  )
}
```

Plain CSS and CSS Modules can use the raw custom properties directly:

```css
.app-shell {
  min-height: 100dvh;
  padding: var(--mw-spacing-sp-24);
  color: var(--mw-color-text);
  background: var(--mw-color-background);
}
```

## Use Typed Components

Import components, enums, and prop types from the same package. The values line up with the same core recipes and preset CSS.

```tsx
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
  type H1Props,
  type InputFieldProps,
  type ParagraphProps,
} from "@marwes-ui/react"

const primaryAction: ButtonProps = {
  variant: ButtonVariant.primary,
  size: ButtonSize.md,
  children: "Create project",
}

const emailField: InputFieldProps = {
  label: "Email",
  helperText: "Used for project notifications.",
  input: {
    type: "email",
    placeholder: "you@example.com",
  },
}

const titleProps: H1Props = {
  size: "h2",
}

const descriptionProps: ParagraphProps = {
  size: "md",
}

export function ProjectPanel() {
  return (
    <Card title="Project setup">
      <StatusBadge variant={BadgeVariant.success}>Ready</StatusBadge>
      <Spacer spacing={Spacings.sp16} />
      <H1 {...titleProps}>Launch workspace</H1>
      <Paragraph {...descriptionProps}>
        Components share theme tokens, typed variants, spacing, and semantic metadata.
      </Paragraph>
      <InputField {...emailField} />
      <Spacer spacing={Spacings.sp24} />
      <Button {...primaryAction} />
      <SubmitButton>Save changes</SubmitButton>
    </Card>
  )
}
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

The default Marwes theme is already active. Pass `theme` only when a brand or design file needs to change the baseline.

```tsx
import { MarwesProvider, mwAvailableFonts, type ThemeInput } from "@marwes-ui/react"

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

export function App() {
  return (
    <MarwesProvider theme={brandTheme}>
      <AppShell />
    </MarwesProvider>
  )
}
```

The provider resolves `ThemeInput` into `--mw-*` CSS variables. Preset CSS consumes those variables across the full component system.

Marwes is designed to look great from the beginning. Start with the default preset, then override only the colors, fonts, radius, or density that belong to your product. Unspecified values keep the polished Marwes defaults.

## Light And Dark Mode

MarwesProvider can own the active mode for the app. Use `useThemeMode()` anywhere under the provider to read or change it; every component under the provider receives the matching `--mw-*` variables and `mw-theme--light` / `mw-theme--dark` class.

```tsx
import { Button, ButtonVariant, MarwesProvider, useThemeMode } from "@marwes-ui/react"

function ThemeToggle() {
  const { mode, toggleMode } = useThemeMode()

  return (
    <Button variant={ButtonVariant.secondary} onClick={toggleMode}>
      Use {mode === "dark" ? "light" : "dark"} mode
    </Button>
  )
}

export function App() {
  return (
    <MarwesProvider defaultMode="light">
      <ThemeToggle />
      <AppShell />
    </MarwesProvider>
  )
}
```

`defaultMode` sets the initial uncontrolled mode. `toggleMode()` updates the provider, so Marwes components, preset CSS, and custom app styles that use `--mw-*` variables all move together without duplicating local theme state.

For a simple brand pass, override shared values once and let Marwes fill the rest. If your product needs different brand colors in light and dark mode, control `mode` and switch between two small `ThemeInput` override objects:

```tsx
import { useState } from "react"
import {
  Button,
  ButtonVariant,
  MarwesProvider,
  type ThemeInput,
  type ThemeMode,
  useThemeMode,
} from "@marwes-ui/react"

const themeByMode = {
  light: {
    color: {
      primary: "#2457FF",
      background: "#F8FAFC",
      surface: "#FFFFFF",
      text: "#111827",
      border: "#D1D5DB",
      focus: "#2457FF",
    },
  },
  dark: {
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

function ThemeToggle() {
  const { mode, toggleMode } = useThemeMode()

  return (
    <Button variant={ButtonVariant.secondary} onClick={toggleMode}>
      Use {mode === "dark" ? "light" : "dark"} mode
    </Button>
  )
}

export function App() {
  const [mode, setMode] = useState<ThemeMode>("light")

  return (
    <MarwesProvider mode={mode} theme={themeByMode[mode]} onModeChange={setMode}>
      <ThemeToggle />
      <AppShell />
    </MarwesProvider>
  )
}
```

Mode-specific defaults fill every omitted token, so each override can stay small. `theme={{ mode: "dark" }}` is still enough for the default dark baseline.

## Custom Styling Tokens

`MarwesProvider` resolves `ThemeInput` into `--mw-*` CSS variables. Marwes components and preset CSS consume those variables automatically. The custom styling token helpers let app-owned styles use the same provider-scoped values instead of hard-coding colors, spacing, radius, typography, or duplicated `var(...)` strings.

Use the helpers by purpose:

- `mwThemeVars` is the default styling helper. It returns CSS `var(...)` references for styled-components, Emotion, vanilla-extract, inline style values, and config files.
- `mwThemeVarNames` returns raw custom property names for assigning provider-scoped overrides in style objects or tooling.
- `mwVar()` wraps custom or advanced `--mw-*` names when the named token object does not cover a specialized case.
- `mwStyledTheme` is a plain object that mirrors `mwThemeVars` for styled-components or Emotion `ThemeProvider` usage.

```tsx
import type { ReactNode } from "react"
import { mwStyledTheme, mwThemeVarNames, mwThemeVars, mwVar } from "@marwes-ui/react"
import styled, { ThemeProvider } from "styled-components"

const Panel = styled.section`
  padding: ${mwThemeVars.spacing.sp24};
  color: ${mwThemeVars.color.text};
  background: ${mwThemeVars.color.surface};
  border-radius: ${mwThemeVars.ui.radius};
`

const InlinePanel = () => (
  <div
    style={{
      [mwThemeVarNames.color.focus]: "#FF00AA",
      color: mwThemeVars.color.text,
      outlineColor: mwVar("--mw-color-focus", "#2457FF"),
    }}
  />
)

const AppTheme = ({ children }: { children: ReactNode }) => (
  <ThemeProvider theme={mwStyledTheme}>{children}</ThemeProvider>
)
```

Plain CSS and CSS Modules do not need a JavaScript bridge:

```css
.panel {
  padding: var(--mw-spacing-sp-24);
  color: var(--mw-color-text);
  border-radius: var(--mw-ui-radius);
}
```

This enables React apps to keep custom panels, local layouts, third-party CSS-in-JS components, and design-tool integrations visually tied to the same active theme as Marwes components. Changing `MarwesProvider theme={...}` updates both preset components and app-owned styles.

Keep the APIs separate:
- Use `Spacings.sp24` for Marwes spacing props such as `<Spacer spacing={Spacings.sp24} />`.
- Use `mwThemeVars.spacing.sp24` for custom CSS values.
- Use `mwThemeVarNames.spacing.sp24` when assigning or inspecting a CSS custom property name.
- Use `useTheme()` when React logic needs resolved runtime values such as `"#2457FF"`.

## Google Fonts DX

Most Google Font use cases only need `mwAvailableFonts`; no `fontLoading` prop is needed.

```tsx
import { MarwesProvider, mwAvailableFonts, type ThemeInput } from "@marwes-ui/react"

const fontTheme = {
  font: {
    primary: mwAvailableFonts.Poppins,
    secondary: mwAvailableFonts.Lora,
  },
} satisfies ThemeInput

<MarwesProvider
  theme={fontTheme}
>
  <App />
</MarwesProvider>
```

For self-hosted or licensed fonts, use `BrandSans`, `BrandSerif`, `BrandMono`, or `createFontStack()`.

## Semantic Buttons

Prefer purpose components for common actions. They lock UX intent and emit AI-readable metadata, so the component is not just "a button with red styling" but a known action with known risk.

```tsx
import {
  CancelButton,
  CreateButton,
  DestructiveButton,
  SubmitButton,
} from "@marwes-ui/react"

<CancelButton>Cancel</CancelButton>
<CreateButton>Create</CreateButton>
<SubmitButton>Save</SubmitButton>
<DestructiveButton>Delete</DestructiveButton>
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

Use raw `Button` props when you intentionally need a custom combination.

```tsx
import { Button, ButtonAction, ButtonSize, ButtonVariant } from "@marwes-ui/react"

<Button
  action={ButtonAction.submit}
  size={ButtonSize.md}
  variant={ButtonVariant.primary}
>
  Submit
</Button>
```

## Why It Is Accessible

Marwes React components are accessible because the adapter renders a shared core contract, not because each component hand-rolls ARIA in isolation.

- Core recipes produce typed `a11y` output for roles, labels, described-by wiring, invalid state, disabled state, and semantic metadata.
- React components prefer native DOM controls first: `button`, `input`, `select`, `textarea`, `hr`, and standard form wiring.
- Field components connect visible labels, helper text, and errors through `id`, `htmlFor`, `aria-describedby`, `aria-invalid`, and polite error announcements.
- Coordinated widgets carry explicit contracts: tabs wire `tablist`/`tab`/`tabpanel`, dialogs own dialog semantics, toasts expose live-region behavior, and purpose buttons expose risk metadata.
- Storybook accessibility smoke checks run through the Storybook a11y addon for the promoted React families, and shared contract tests keep React aligned with Vue.

Example:

```tsx
import { InputField, type InputFieldProps } from "@marwes-ui/react"

const receiptEmailField = {
  label: "Email",
  helperText: "Used for receipts.",
  error: "Enter a valid email.",
  input: { type: "email", placeholder: "you@example.com" },
} satisfies InputFieldProps

<InputField {...receiptEmailField} />
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

The important part is that the same label, helper, error, and invalid contract is tested at the shared contract layer and then applied by the React adapter.

## Package Boundaries

- `@marwes-ui/core` owns recipes, theme resolution, a11y mapping, and semantic metadata.
- `@marwes-ui/presets` owns default preset CSS.
- `@marwes-ui/react` owns React rendering and provider behavior.

## Scripts

```bash
pnpm --filter @marwes-ui/react build
pnpm --filter @marwes-ui/react typecheck
pnpm --filter @marwes-ui/react test
```

## Related Docs

- [Docs index](https://github.com/niklas-westman/marwes/tree/main/docs)
- [Architecture](https://github.com/niklas-westman/marwes/blob/main/docs/reference/architecture.md)
- [Figma to Marwes](https://github.com/niklas-westman/marwes/blob/main/docs/guides/figma-to-marwes.md)
