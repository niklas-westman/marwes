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
