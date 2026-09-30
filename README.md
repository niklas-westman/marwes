<div align="center">

<img alt="Marwes Design System" src=".github/assets/cover-v3.png" width="100%">

<br>
<br>

# Marwes Design System

**Build one branded, accessible UI language across React, Vue, and Svelte. Install one adapter, wrap once, and theme every component.**

React • Vue • Svelte • Framework-agnostic core • Static CSS • Type-safe • A11y-first • Agent-readable

[**marwes.io**](https://marwes.io) — official site, theme builder, and install guides
[React setup](https://marwes.io/docs/get-started/react/) • [Vue setup](https://marwes.io/docs/get-started/vue/) • [Svelte setup](https://marwes.io/docs/get-started/svelte/) • [Component catalog](https://marwes.io/docs/components/)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

## ✨ Why Marwes?

<table>
<tr>
<td width="50%">

### 🎯 **Framework-Agnostic Core**

Pure TypeScript logic with thin React, Vue, and Svelte adapters built from the same contracts.

### 🤖 **AI-Adapted by Design**

Stable component contracts, semantic actions, generated registries, and explicit a11y metadata make Marwes easier for agents to inspect, modify, and extend without guessing.

### ♿ **Accessibility First**

A11y isn't bolted on. Core owns semantic contracts, adapters apply them to real DOM, and Storybook a11y smoke checks catch regressions in the promoted families.

### 🚀 **Static Preset CSS**

Static preset CSS and CSS variables, with no CSS-in-JS runtime required by Marwes.

</td>
<td width="50%">

### 🎨 **Beautiful Defaults**

Ships with the firstEdition theme and CSS preset—modern typography, semantic colors, and contrast-aware defaults aligned to WCAG AA goals.

### 🔧 **Simple Theme API**

Override what matters. No bloated config objects.

### 📐 **Figma Integration**

Design tokens map to theme keys. Component specs reference Figma nodes. Design-to-code workflow included.

</td>
</tr>
</table>

---

## 🤖 Built for AI-Assisted Engineering

Marwes is shaped for teams building with human designers, frontend engineers, and AI agents in the same workflow.

- **Semantic component APIs** make intent explicit: submit, cancel, create, delete, navigate, edit, and reset are first-class actions instead of loose styling choices.
- **RenderKit output is structured** so adapters receive predictable `tag`, `className`, `vars`, and `a11y` fields instead of opaque component internals.
- **Generated component registries** document package exports, stories, tests, accessibility notes, and implementation files in a format agents can search and verify.
- **Design tokens stay named and typed** so Figma-to-code changes can land in theme keys and CSS variables instead of scattered one-off values.
- **Framework boundaries are strict** which lets agents update core behavior once and have React, Vue, and Svelte adapters inherit the same contract.

The goal is not "AI magic". The goal is a component system with enough structure that AI can make useful changes with less context, fewer assumptions, and better verification paths.

---

## ♿ Why It Is Accessible

Marwes is accessible because accessibility is part of the component contract, not a checklist added after rendering.

- **Core owns a11y logic** through typed recipes and helpers that produce roles, ARIA state, label wiring, description wiring, invalid state, and semantic metadata.
- **React, Vue, and Svelte adapters stay thin** so every framework applies the same core contract to native DOM elements instead of inventing separate accessibility behavior per framework.
- **Native controls come first** for buttons, inputs, selects, checkboxes, radios, textareas, and form fields, with ARIA added only where a pattern needs explicit wiring.
- **Field components wire labels, helper text, and errors** into `for`, `id`, `aria-describedby`, `aria-invalid`, and polite error announcements.
- **Storybook a11y smoke checks** run through the Storybook a11y addon for the current promoted families in React, Vue, and Svelte.

Example: an invalid field is not just styled red. The component contract also wires the accessible name, description, and invalid state:

```tsx
<InputField
  label="Email"
  helperText="Used for receipts."
  error="Enter a valid email."
  input={{ type: "email", placeholder: "you@example.com" }}
/>
```

That resolves to DOM wiring like:

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

The honest boundary: automation gives strong coverage for contracts and smoke-tested stories, but real screen-reader behavior for high-risk widgets still needs targeted manual review. The current support model is documented in [Accessibility support model](docs/reference/accessibility.md).

---

## 🚀 Installation

Use the CLI from the root of an existing Vite app. It installs the selected adapter, wires `MarwesProvider`, and runs the setup checks:

```bash
pnpm dlx @marwes-ui/cli init --adapter react
pnpm dlx @marwes-ui/cli init --adapter vue
pnpm dlx @marwes-ui/cli init --adapter svelte
```

Verify the result, including a production build:

```bash
pnpm dlx @marwes-ui/cli doctor --run-build
```

For a new app, use the official Vite scaffolder:

```bash
pnpm create marwes@latest my-app --template react-ts
pnpm create marwes@latest my-app --template vue-ts
pnpm create marwes@latest my-app --template svelte-ts
```

The CLI's automatic provider patching targets known Vite starter layouts. If it reports `manual-action-required`, follow the complete provider example it prints and then rerun `doctor --run-build`.

Manual installation is the fallback path: add exactly one adapter package, keep the framework peer dependency in a supported version, and render your app below that adapter's `MarwesProvider`. The adapter already includes the default preset CSS; do not add a second Marwes stylesheet.

```tsx
import { MarwesProvider, PrimaryButton } from "@marwes-ui/react"

export function App() {
  return (
    <MarwesProvider>
      <PrimaryButton>Continue</PrimaryButton>
    </MarwesProvider>
  )
}
```

- [React setup](https://marwes.io/docs/get-started/react/)
- [Vue setup](https://marwes.io/docs/get-started/vue/)
- [Svelte setup](https://marwes.io/docs/get-started/svelte/)

---

## 🏗️ The Three-Layer Architecture

What makes Marwes different? **Complete separation of concerns:**

```
┌─────────────────────────────────────┐
│   @marwes-ui/react / vue / svelte  │  ← Thin adapters
│   Apply RenderKit to framework DOM │
├─────────────────────────────────────┤
│   @marwes-ui/presets (Static CSS)  │  ← No CSS-in-JS runtime
│   Design tokens + .mw-* classes     │
├─────────────────────────────────────┤
│   @marwes-ui/core (Pure Logic)     │  ← Framework-agnostic TypeScript
│   Theme, recipes, a11y, types       │
└─────────────────────────────────────┘
```

**Why this matters:**

- Core has **zero runtime dependencies** (not even React types)
- Adapter boundaries are explicit and use the same core contracts
- CSS ships as a static preset driven by provider-scoped variables
- Logic is **testable without frameworks**

---

## 🧩 Components

The public consumer API is Field/Purpose-first. Use `InputField`, `CheckboxField`, `RadioGroupField`, `SwitchField`, `SliderField`, `AccordionField`, `DatePickerField`, `PaginationField`, and `SegmentedControlField` rather than importing their internal atoms.

[Browse the framework-aware component catalog](https://marwes.io/docs/components/) or inspect the interactive [React](https://storybook-react.marwes.io/latest/), [Vue](https://storybook-vue.marwes.io/latest/), and [Svelte](https://storybook-svelte.marwes.io/latest/) Storybooks.

---

## 🎨 Theming

First edition is the default provider theme. Pass a simple, typed `ThemeInput` object only when you want to override that baseline. Design data should be mapped into this object before it reaches `MarwesProvider`; the provider does not parse Figma files or design exports at runtime.

```tsx
import { mwAvailableFonts } from "@marwes-ui/react"

<MarwesProvider
  theme={{
    color: {
      primary: "#5B8CFF",
      danger: "#D90429",
      surfaceElevated: "#FFFFFF",
    },
    font: {
      primary: mwAvailableFonts.Poppins,
      secondary: mwAvailableFonts.Lora,
    },
    ui: {
      radius: 12,
      density: "comfortable",
    },
  }}
>
  <App />
</MarwesProvider>
```

The theme object is consequential across the component system:

- `color.primary`, semantic colors, surface, text, border, and focus values become `--mw-color-*` CSS variables.
- `font`, `ui.radius`, `ui.density`, and typography values become shared type, radius, and sizing variables.
- React, Vue, and Svelte use the same `ThemeInput` shape.
- Preset CSS consumes those variables, so component visuals follow the provider theme without adapter-specific styling.

Use the same provider-scoped variables in custom styling:

```tsx
import { mwThemeVars } from "@marwes-ui/react"
import styled from "styled-components"

const Panel = styled.section`
  padding: ${mwThemeVars.spacing.sp24};
  color: ${mwThemeVars.color.text};
  background: ${mwThemeVars.color.surface};
  border: 1px solid ${mwThemeVars.color.border};
  border-radius: ${mwThemeVars.ui.radius};
`
```

Plain CSS and CSS Modules can use the raw variables directly:

```css
.panel {
  padding: var(--mw-spacing-sp-24);
  color: var(--mw-color-text);
  background: var(--mw-color-surface);
  border-radius: var(--mw-ui-radius);
}
```

Use `Spacings.sp24` for Marwes spacing props, `mwThemeVars.spacing.sp24` for custom CSS, and `useTheme()` when code needs resolved runtime values. `themeToCSSVars()` remains the low-level conversion helper for providers and tooling.

For AI-generated themes, produce this shape:

```ts
import { mwAvailableFonts } from "@marwes-ui/react"

const theme = {
  mode: "light",
  color: {
    primary: "#5B8CFF",
    background: "#FFFFFF",
    surface: "#F9FAFB",
    text: "#141414",
    border: "rgba(0,0,0,0.4)",
    focus: "#2684FF",
  },
  font: {
    primary: mwAvailableFonts.Poppins,
    secondary: mwAvailableFonts.Lora,
  },
  ui: {
    radius: 8,
    density: "comfortable",
  },
}
```

### Graphical Profile Mapping

Map a brand or graphical profile into `ThemeInput`, then pass it to `MarwesProvider`.
The provider turns that object into CSS variables consumed by the preset styles.

| Graphical profile field | Marwes theme field |
| --- | --- |
| Primary brand color | `color.primary` |
| Error, success, warning colors | `color.danger`, `color.success`, `color.warning` |
| App/page background | `color.background` |
| Card or panel surface | `color.surface`, `color.surfaceElevated` |
| Body text and muted text | `color.text`, `color.textMuted` |
| Border and focus ring | `color.border`, `color.focus` |
| Brand font | `font.primary` via `mwAvailableFonts` or `createFontStack()` |
| Radius and density | `ui.radius`, `ui.density` |

**No CSS wizard required.** Just a typed JavaScript object.

---

## 📚 Documentation

| Guide | Description |
| --- | --- |
| [Contributor start here](docs/start-here.md) | Single starting point for repository work and contribution routing |
| [Docs index](docs/README.md) | Best starting point for understanding the repo |
| [Architecture](docs/reference/architecture.md) | Package boundaries, RenderKit flow, and repo structure |
| [Specification](docs/reference/spec.md) | Formal requirements and decisions |
| [Testing](docs/reference/testing.md) | Test layers and current commands |
| [Accessibility support model](docs/reference/accessibility.md) | What Marwes automates, what still needs manual review, and current family risk tiers |
| [Adding components](docs/guides/adding-components.md) | Step-by-step implementation workflow |
| [Figma to Marwes](docs/guides/figma-to-marwes.md) | Design-to-code mapping and token workflow |
| [Component registry](docs/registry/README.md) | Family-level source map and implementation status |

---

## 🛠️ Development

```bash
# Install dependencies
pnpm install

# Watch package builds
pnpm dev:packages

# Run the React playground
pnpm dev:playground

# Run Storybook
pnpm dev:storybook:react
pnpm dev:storybook:vue

# Validate the repo
pnpm typecheck
pnpm test
pnpm build

# Check internal markdown links
pnpm check:compass
```

## Release Notes For Package Changes

Pull requests that change publishable packages under `packages/**` must include a Changesets entry.

Run:

```bash
pnpm changeset
```

Choose the release type:

- `patch` for bug fixes, internal behavior fixes, or package API docs
- `minor` for new public APIs, new components, or backwards-compatible features
- `major` for breaking public APIs or behavior

Commit the generated `.changeset/*.md` file with the PR. If a package change should not produce a release, add an empty changeset:

```bash
pnpm changeset add --empty
```

CI enforces this only for `packages/**`. Changes to Storybook, playgrounds, docs, workflows, or root tooling do not require a changeset unless they also touch publishable packages.

The published Marwes packages are versioned as a fixed group. If a changeset includes any of `@marwes-ui/core`, `@marwes-ui/react`, `@marwes-ui/presets`, `@marwes-ui/vue`, or `@marwes-ui/svelte`, include all five in that same changeset.

**Repo structure:**

- `packages/core` — Framework-agnostic TypeScript logic
- `packages/presets` — Design tokens and static CSS
- `packages/react` — React adapter
- `packages/vue` — Vue adapter
- `packages/svelte` — Svelte adapter
- `apps/storybook-react` — React component documentation
- `apps/storybook-vue` — Vue component documentation
- `apps/storybook-svelte` — Svelte component documentation
- `apps/playground-react` — Integration testing and manual verification

---

## 📦 Packages

| Package | Description |
| --- | --- |
| `@marwes-ui/core` | Framework-agnostic logic |
| `@marwes-ui/presets` | Static CSS presets |
| `@marwes-ui/react` | React adapter |
| `@marwes-ui/vue` | Vue adapter |
| `@marwes-ui/svelte` | Svelte adapter |
| `@marwes-ui/cli` | Official installer for existing apps (`pnpm dlx @marwes-ui/cli init`) |
| `create-marwes` | Vite-style starter for new apps (`pnpm create marwes@latest my-app`) |

---

## 🤝 Philosophy

- **Quality over quantity** — Small, focused component set done well
- **Accessibility is architecture** — Not an afterthought
- **Framework flexibility** — Don't lock teams into one framework
- **Performance by default** — Static CSS means faster apps
- **Spec-driven development** — Every feature documented first

---

## 📄 License

MIT © Marwes Contributors

See [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with care for teams who value quality, accessibility, and performance.**

[⭐ Star on GitHub](https://github.com/niklas-westman/marwes) • [📖 Docs](docs/README.md) • [🎨 Storybook](https://storybook-react.marwes.io/latest/)

</div>
