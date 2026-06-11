---
"@marwes-ui/core": minor
"@marwes-ui/react": minor
"@marwes-ui/presets": minor
"@marwes-ui/vue": minor
"@marwes-ui/svelte": minor
---

Add the next Marwes component family wave and finish release-blocking component polish.

Adds `Banner`, `Breadcrumb`, `ContextMenu`, `Drawer`, `Pagination`, `ProgressBar`, `SegmentedControl`, and `Text` across the shared core recipes, firstEdition preset CSS, React, Vue, and Svelte packages.

Each new family includes Storybook stories and `Introduction.mdx` documentation aligned with the existing component documentation pattern, plus registry artifacts, taxonomy/docs checks, and framework adapter coverage for a release-ready public package surface.

Adds `IconButton`, the `danger` button variant, the `sp-12` spacing token, native select chevron parity, wrapper-adaptive field widths, TabGroup overflow containment, and DialogModal surface controls across React, Vue, Svelte, presets, Storybook documentation, and registry artifacts.

Adds `label` as a consumer-friendly accessible-name alias for standalone controls that previously required `ariaLabel`, and cleans up Storybook consistency auditing so grouped React/Vue variant exports are compared against Svelte one-file component exports without false parity failures.

Cleans up Svelte adapter diagnostics by removing stale state-capture warnings, preserving shared ARIA contracts with explicit Svelte annotations, and aligning purpose radio groups with controlled/uncontrolled behavior.

Aligns Svelte package styling behavior with React and Vue by loading firstEdition CSS from the public package entry, preserving the CSS side effect in package metadata, and adding shared contract enrollment for the remaining cross-framework Svelte surfaces.

Adds a cross-framework adapter architecture map and `pnpm check:adapter-architecture` guardrail so React, Vue, and Svelte package structure, Storybook introductions, root exports, shared contracts, and package CSS policy cannot drift silently.
