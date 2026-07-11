# @marwes-ui/svelte

## 1.4.1

### Patch Changes

- [#42](https://github.com/niklas-westman/marwes/pull/42) [`af9416c`](https://github.com/niklas-westman/marwes/commit/af9416cafa45a0e75d108bfd0f1bd849f6084b4c) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Docs polish: root README now leads with the marwes.io hub link (matching every package README) and the Packages table lists all seven published packages — the previously missing `@marwes-ui/svelte`, `@marwes-ui/cli`, and `create-marwes` are now included with usage hints.

- Updated dependencies [[`af9416c`](https://github.com/niklas-westman/marwes/commit/af9416cafa45a0e75d108bfd0f1bd849f6084b4c)]:
  - @marwes-ui/core@1.4.1
  - @marwes-ui/presets@1.4.1

## 1.4.0

### Minor Changes

- [#39](https://github.com/niklas-westman/marwes/pull/39) [`965a3af`](https://github.com/niklas-westman/marwes/commit/965a3af4fd05bf5342a687c55d52188c7c22ae62) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Add the next Marwes component family wave and finish release-blocking component polish.

  Adds `Banner`, `Breadcrumb`, `ContextMenu`, `Drawer`, `Pagination`, `ProgressBar`, `SegmentedControl`, and `Text` across the shared core recipes, firstEdition preset CSS, React, Vue, and Svelte packages.

  Each new family includes Storybook stories and `Introduction.mdx` documentation aligned with the existing component documentation pattern, plus registry artifacts, taxonomy/docs checks, and framework adapter coverage for a release-ready public package surface.

  Adds `IconButton`, the `danger` button variant, the `sp-12` spacing token, native select chevron parity, wrapper-adaptive field widths, TabGroup overflow containment, and DialogModal surface controls across React, Vue, Svelte, presets, Storybook documentation, and registry artifacts.

  Adds `label` as a consumer-friendly accessible-name alias for standalone controls that previously required `ariaLabel`, and cleans up Storybook consistency auditing so grouped React/Vue variant exports are compared against Svelte one-file component exports without false parity failures.

  Cleans up Svelte adapter diagnostics by removing stale state-capture warnings, preserving shared ARIA contracts with explicit Svelte annotations, and aligning purpose radio groups with controlled/uncontrolled behavior.

  Aligns Svelte package styling behavior with React and Vue by loading firstEdition CSS from the public package entry, preserving the CSS side effect in package metadata, and adding shared contract enrollment for the remaining cross-framework Svelte surfaces.

  Adds a cross-framework adapter architecture map and `pnpm check:adapter-architecture` guardrail so React, Vue, and Svelte package structure, Storybook introductions, root exports, shared contracts, and package CSS policy cannot drift silently.

- [#40](https://github.com/niklas-westman/marwes/pull/40) [`5bb997c`](https://github.com/niklas-westman/marwes/commit/5bb997cb03c037233afc3e42288f6ed037d1b1c5) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Complete the `label` accessible-name alias rollout across standalone controls.

  `Radio` and `InputOtp` now accept `label` alongside `ariaLabel`, matching the pattern already used by `Checkbox`, `Switch`, `Slider`, `Input`, `Select`, `Textarea`, and `RichText`. `IconButton` prop types now surface `label` explicitly for IDE discoverability (the underlying `Button` recipe already resolved it). Consumers can now use `label="…"` uniformly across every standalone control; `ariaLabel` continues to work.

### Patch Changes

- Updated dependencies [[`965a3af`](https://github.com/niklas-westman/marwes/commit/965a3af4fd05bf5342a687c55d52188c7c22ae62), [`5bb997c`](https://github.com/niklas-westman/marwes/commit/5bb997cb03c037233afc3e42288f6ed037d1b1c5)]:
  - @marwes-ui/core@1.4.0
  - @marwes-ui/presets@1.4.0

## 1.3.0

### Minor Changes

- [#37](https://github.com/niklas-westman/marwes/pull/37) [`cc771ca`](https://github.com/niklas-westman/marwes/commit/cc771cac66b833a7b7e40f6402d406982119275d) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Release 1.3.0 — Svelte adapter and cross-framework alignment.

  **@marwes-ui/svelte (new)**
  New public Svelte 5 adapter with 112 component exports across 24 component families.
  Full parity with React and Vue adapters. Ships MarwesProvider, useTheme, useThemeMode,
  useToast, and SSR helpers.

  **@marwes-ui/presets**

  - Badge: neutral label uses text/secondary (#595959), warning label uses direct Amber/700 (#B45309)
  - Tab: transparent background, text/primary label, opacity-based hover (5% text color)
  - Toast: subtle icon fallbacks (#595959 light / #A3A3A3 dark), warning text aligned with badge/stat-tile, dark mode intent colors show through in text/action
  - Toast/StatTile: small action and trend text now use readable status text tokens so Storybook a11y smoke passes color contrast in light and dark mode
  - Spinner: dots-round, dots-square, lines use per-segment opacity cycling (no SVG rotation)
  - Accordion/Toast: dark mode surface set to #0F0F0F

  **@marwes-ui/react / @marwes-ui/vue**

  - Storybook theme toggle synced with iframe background
  - All stories aligned across React, Svelte, and Vue
  - Added storybook alignment audit script

  **@marwes-ui/core**

  - EditButton, VerifyButton, RefreshButton default icons added to Svelte adapter

### Patch Changes

- Updated dependencies [[`cc771ca`](https://github.com/niklas-westman/marwes/commit/cc771cac66b833a7b7e40f6402d406982119275d)]:
  - @marwes-ui/core@1.3.0

## 1.2.0

### Minor Changes

- Initial release of `@marwes-ui/svelte` — native Svelte 5 adapter over `@marwes-ui/core`.
