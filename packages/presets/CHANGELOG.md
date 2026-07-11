# @marwes-ui/presets

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

- [#35](https://github.com/niklas-westman/marwes/pull/35) [`a9e69b8`](https://github.com/niklas-westman/marwes/commit/a9e69b8040d97e2496eb0d718d6707dc86ceed3b) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Add Date Picker component across core recipes, firstEdition preset CSS, React adapter, Vue adapter, tests, and Storybook coverage.

- [#35](https://github.com/niklas-westman/marwes/pull/35) [`a9e69b8`](https://github.com/niklas-westman/marwes/commit/a9e69b8040d97e2496eb0d718d6707dc86ceed3b) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Add Skeleton atom across core recipes, firstEdition preset CSS, React adapter, Vue adapter, tests, and Storybook coverage.

- [#35](https://github.com/niklas-westman/marwes/pull/35) [`a9e69b8`](https://github.com/niklas-westman/marwes/commit/a9e69b8040d97e2496eb0d718d6707dc86ceed3b) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Add StatTile across core recipes, firstEdition preset CSS, React adapter, Vue adapter, tests, and Storybook coverage.

### Patch Changes

- [#35](https://github.com/niklas-westman/marwes/pull/35) [`a9e69b8`](https://github.com/niklas-westman/marwes/commit/a9e69b8040d97e2496eb0d718d6707dc86ceed3b) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Promote Storybook accessibility smoke coverage across React and Vue stories, and fix related contrast, labeling, date picker, select field, and dialog modal accessibility issues.

- Updated dependencies [[`a9e69b8`](https://github.com/niklas-westman/marwes/commit/a9e69b8040d97e2496eb0d718d6707dc86ceed3b), [`a9e69b8`](https://github.com/niklas-westman/marwes/commit/a9e69b8040d97e2496eb0d718d6707dc86ceed3b), [`a9e69b8`](https://github.com/niklas-westman/marwes/commit/a9e69b8040d97e2496eb0d718d6707dc86ceed3b), [`a9e69b8`](https://github.com/niklas-westman/marwes/commit/a9e69b8040d97e2496eb0d718d6707dc86ceed3b)]:
  - @marwes-ui/core@1.2.0

## 1.1.0

### Minor Changes

- [#29](https://github.com/niklas-westman/marwes/pull/29) [`ac9f0c0`](https://github.com/niklas-westman/marwes/commit/ac9f0c0b3807169cd89d268d043895186438a591) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Run package test scripts with `NODE_ENV=test` for stable local and changed-scope validation.

### Patch Changes

- Updated dependencies [[`ac9f0c0`](https://github.com/niklas-westman/marwes/commit/ac9f0c0b3807169cd89d268d043895186438a591)]:
  - @marwes-ui/core@1.1.0

## 1.0.5

### Patch Changes

- [#27](https://github.com/niklas-westman/marwes/pull/27) [`a7798a1`](https://github.com/niklas-westman/marwes/commit/a7798a13f315275a6ef1de65caa0dfe148cd53fa) Thanks [@niklas-westman](https://github.com/niklas-westman)! - enabled the possibility of SSR

- Updated dependencies [[`a7798a1`](https://github.com/niklas-westman/marwes/commit/a7798a13f315275a6ef1de65caa0dfe148cd53fa)]:
  - @marwes-ui/core@1.0.5

## 1.0.4

### Patch Changes

- [#25](https://github.com/niklas-westman/marwes/pull/25) [`e6eed2a`](https://github.com/niklas-westman/marwes/commit/e6eed2a392e33dd171d3b082df25d056564c00cf) Thanks [@niklas-westman](https://github.com/niklas-westman)! - updated tailwind docs support

- Updated dependencies [[`e6eed2a`](https://github.com/niklas-westman/marwes/commit/e6eed2a392e33dd171d3b082df25d056564c00cf)]:
  - @marwes-ui/core@1.0.4

## 1.0.3

### Patch Changes

- [#23](https://github.com/niklas-westman/marwes/pull/23) [`6a76863`](https://github.com/niklas-westman/marwes/commit/6a7686369b018c8e8738581b29526d52210996cc) Thanks [@niklas-westman](https://github.com/niklas-westman)! - adds optional global theme-mode synchronization

- Updated dependencies [[`6a76863`](https://github.com/niklas-westman/marwes/commit/6a7686369b018c8e8738581b29526d52210996cc)]:
  - @marwes-ui/core@1.0.3

## 1.0.2

### Patch Changes

- [#21](https://github.com/niklas-westman/marwes/pull/21) [`63b33bc`](https://github.com/niklas-westman/marwes/commit/63b33bc8ffd47854869153df46cab24334ff954f) Thanks [@niklas-westman](https://github.com/niklas-westman)! - adding system theme support

- Updated dependencies [[`63b33bc`](https://github.com/niklas-westman/marwes/commit/63b33bc8ffd47854869153df46cab24334ff954f)]:
  - @marwes-ui/core@1.0.2

## 1.0.1

### Patch Changes

- [#19](https://github.com/niklas-westman/marwes/pull/19) [`0920746`](https://github.com/niklas-westman/marwes/commit/09207469a0502f72784cbde1c9e3cba9799fac95) Thanks [@niklas-westman](https://github.com/niklas-westman)! - clarify theme toggle and update readme

- Updated dependencies [[`0920746`](https://github.com/niklas-westman/marwes/commit/09207469a0502f72784cbde1c9e3cba9799fac95)]:
  - @marwes-ui/core@1.0.1

## 1.0.0

### Major Changes

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Release Marwes 1.0.0 with the stabilized public package set, including the Marwes-first Select default, `sp-*` spacing tokens, vertical slider support, designer-feedback polish, and aligned React and Vue adapter contracts.

### Minor Changes

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Remove the `BadgeVariant.brand` option from the badge API, preset styles, and Storybook examples across React and Vue.

### Patch Changes

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Add the first Avatar release with the base atom, `AvatarBadge`, `AvatarGroup`, and the semantic purpose wrappers `ProfileAvatar`, `PresenceAvatar`, and `TeamAvatarGroup`, including core contracts, firstEdition preset styling, React and Vue adapters, Storybook docs and stories, and cross-adapter contract coverage.

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Align checkbox group field layout and option typography with the latest Figma checkbox group reference in React, Vue, and firstEdition presets.

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Clarify the Dialog accessibility contract by keeping the raw `Dialog` shell non-modal by default, moving modal semantics to `DialogModal`, adding shared React/Vue modal contract coverage, strengthening focus-fallback styling, and aligning Storybook docs and stories with the actual dialog layers.

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Add `RichText` and `RichTextField` to the input family, including core contracts, preset styling, React and Vue adapters, Storybook stories, and accessibility/test coverage.

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Add the first Slider release with core recipe and accessibility mapping, firstEdition preset styling, React and Vue adapters, `SliderField` molecule wrappers, Storybook docs and stories, and test coverage.

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Add the first Spinner release with the synced `classic`, `ring`, `dual`, `dots-round`, `dots-square`, `lines`, and `cross` styles, token and custom sizing, firstEdition preset animation, React and Vue adapters, Button loading integration, `ButtonSpinner` and `EmptyStateSpinner` purpose wrappers, Storybook docs and stories, and cross-adapter contract coverage.

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Add the first Tooltip family release with the standalone `Tooltip` atom and the Figma-aligned `TooltipGroup` molecule, including core contracts, firstEdition preset styling, React and Vue adapters, Storybook docs and stories, and adapter test coverage.

- Updated dependencies [[`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56), [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56), [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56), [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56), [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56), [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56), [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56), [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56), [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56), [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56)]:
  - @marwes-ui/core@1.0.0

## 0.0.4

### Patch Changes

- [#12](https://github.com/niklas-westman/marwes/pull/12) [`afdb19e`](https://github.com/niklas-westman/marwes/commit/afdb19edd7c3620a895f3a83d7b670497b3f60a0) Thanks [@niklas-westman](https://github.com/niklas-westman)! - button and input purpose components setup

- Updated dependencies [[`afdb19e`](https://github.com/niklas-westman/marwes/commit/afdb19edd7c3620a895f3a83d7b670497b3f60a0)]:
  - @marwes-ui/core@0.0.4

## 0.0.3

### Patch Changes

- [#9](https://github.com/niklas-westman/marwes/pull/9) [`c5e3b1a`](https://github.com/niklas-westman/marwes/commit/c5e3b1a1368556f9afbb1a0a9f9fca94a58e5e1d) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Initial package release attempt

- Updated dependencies [[`c5e3b1a`](https://github.com/niklas-westman/marwes/commit/c5e3b1a1368556f9afbb1a0a9f9fca94a58e5e1d)]:
  - @marwes-ui/core@0.0.3

## 0.0.2

### Patch Changes

- [#7](https://github.com/niklas-westman/marwes/pull/7) [`94d3da8`](https://github.com/niklas-westman/marwes/commit/94d3da847f7a631b0dff918b8a6104360a1c425b) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Initial release

- Updated dependencies [[`94d3da8`](https://github.com/niklas-westman/marwes/commit/94d3da847f7a631b0dff918b8a6104360a1c425b)]:
  - @marwes-ui/core@0.0.2

## 0.0.2

### Patch Changes

- [#5](https://github.com/niklas-westman/marwes/pull/5) [`4f4bea6`](https://github.com/niklas-westman/marwes/commit/4f4bea6dc8a36144f8f1852992ed280686ea7494) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Rename packages from @marwes to @marwes-ui

- Updated dependencies [[`4f4bea6`](https://github.com/niklas-westman/marwes/commit/4f4bea6dc8a36144f8f1852992ed280686ea7494)]:
  - @marwes-ui/core@0.0.2
