# @marwes-ui/svelte

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
