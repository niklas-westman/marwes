<div align="center">

# 🎨 Marwes

**A component system with beautiful defaults, zero runtime, and accessibility baked in.**

Framework-agnostic • Static CSS • Type-safe • A11y-first

[Documentation](docs/PROJECT.md) • [Storybook](https://d3hobet9plpuvm.cloudfront.net/storybook-react/latest/)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

## ✨ Why Marwes?

<table>
<tr>
<td width="50%">

### 🎯 **Framework-Agnostic Core**

Pure TypeScript logic. No React dependencies in the core. Add Vue/Svelte adapters in minutes.

### ♿ **Accessibility First**

A11y isn't bolted on—it lives in dedicated logic files. ARIA, focus management, keyboard nav all testable.

### 🚀 **Zero Runtime CSS**

No CSS-in-JS overhead. Static CSS with CSS variables. Ship less JavaScript, load faster.

</td>
<td width="50%">

### 🎨 **Beautiful Defaults**

Ships with firstEdition preset—modern typography, semantic colors, WCAG AA contrast ratios.

### 🔧 **Simple Theme API**

Override what matters. No bloated config objects.

### 📐 **Figma Integration**

Design tokens map to theme keys. Component specs reference Figma nodes. Design-to-code workflow included.

</td>
</tr>
</table>

---

## 🚀 Quick Start

```bash
pnpm add @marwes-ui/react @marwes-ui/presets
```

```tsx
import { MarwesProvider, Button } from "@marwes-ui/react";
import { firstEdition } from "@marwes-ui/presets";
import "@marwes-ui/presets/firstEdition/styles.css";

function App() {
  return (
    <MarwesProvider preset={firstEdition}>
      <Button variant="primary">
        Click me
      </Button>
    </MarwesProvider>
  );
}
```

**That's it.** Accessible, themeable components with zero configuration.

---

## 🏗️ The Three-Layer Architecture

What makes Marwes different? **Complete separation of concerns:**

```
┌─────────────────────────────────────┐
│   @marwes-ui/react (Thin Adapter)  │  ← ~10 lines per component
│   Apply RenderKit to React elements │
├─────────────────────────────────────┤
│   @marwes-ui/presets (Static CSS)  │  ← Zero runtime, CDN-friendly
│   Design tokens + .mw-* classes     │
├─────────────────────────────────────┤
│   @marwes-ui/core (Pure Logic)     │  ← Framework-agnostic TypeScript
│   Theme, recipes, a11y, types       │
└─────────────────────────────────────┘
```

**Why this matters:**

- Core has **zero runtime dependencies** (not even React types)
- Adapters are **community-contributable** (~100 lines each)
- CSS ships **optimized and static** (no JS bundle bloat)
- Logic is **testable without frameworks**

---

## 🧩 Components

**Available now:**

- Button (primary, secondary, text, success variants)
- Input & InputField
- Checkbox & CheckboxField
- Typography (H1, H2, H3, Paragraph)
- Divider
- Icon (lucide icons)

[👉 **Browse all components in Storybook**](https://d3hobet9plpuvm.cloudfront.net/storybook-react/latest/)

---

## 🎨 Theming

Override theme values with a simple, typed API:

```tsx
<MarwesProvider
  preset={firstEdition}
  theme={{
    color: {
      primary: "#5B8CFF",
      secondary: "#FF6B9D",
    },
    ui: {
      radius: 12,
    },
  }}
>
  <App />
</MarwesProvider>
```

**No CSS wizard required.** Just JavaScript objects.

---

## 📚 Documentation

| Guide                                     | Description                |
| ----------------------------------------- | -------------------------- |
| [Project Overview](docs/PROJECT.md)       | Purpose, goals, philosophy |
| [Architecture](docs/ARCHITECTURE.md)      | How the three layers work  |
| [Engineering](docs/ENGINEERING.md)        | Coding conventions         |
| [Figma Workflow](docs/FIGMA_TO_MARWES.md) | Design-to-code sync        |
| [Specification](SPEC.md)                  | Full product spec          |
| [Roadmap](docs/ROADMAP.md)                | Feature planning           |

---

## 🛠️ Development

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Component development
pnpm dev:storybook

# Build everything
pnpm build

# Run tests
pnpm test
```

**Repo structure:**

- `packages/core` — Framework-agnostic TypeScript logic
- `packages/presets` — Design tokens and static CSS
- `packages/react` — React adapter
- `apps/storybook-react` — Component development
- `apps/playground-react` — Integration testing

---

## 📦 Packages

| Package              | Description              |
| -------------------- | ------------------------ |
| `@marwes-ui/core`    | Framework-agnostic logic |
| `@marwes-ui/presets` | Static CSS presets       |
| `@marwes-ui/react`   | React adapter            |

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

[⭐ Star on GitHub](https://github.com/niklas-westman/marwes) • [📖 Docs](docs/PROJECT.md) • [🎨 Storybook](https://d3hobet9plpuvm.cloudfront.net/storybook-react/latest/)

</div>
