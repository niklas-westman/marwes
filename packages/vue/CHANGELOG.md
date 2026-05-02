# @marwes-ui/vue

## 1.0.0

### Major Changes

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Release Marwes 1.0.0 with the stabilized public package set, including the Marwes-first Select default, `sp-*` spacing tokens, vertical slider support, designer-feedback polish, and aligned React and Vue adapter contracts.

### Minor Changes

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Lock purpose buttons to their canonical semantics and visual treatments across React and Vue, rename `DangerButton` to `DestructiveButton`, remove `variant` from purpose-button controls and typed APIs, ignore forbidden overrides with development warnings, and update Storybook docs and tests to direct intentional exceptions through the base `Button` API.

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Remove the `BadgeVariant.brand` option from the badge API, preset styles, and Storybook examples across React and Vue.

### Patch Changes

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Add the first Avatar release with the base atom, `AvatarBadge`, `AvatarGroup`, and the semantic purpose wrappers `ProfileAvatar`, `PresenceAvatar`, and `TeamAvatarGroup`, including core contracts, firstEdition preset styling, React and Vue adapters, Storybook docs and stories, and cross-adapter contract coverage.

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Extend `Button` loading support with normalized object configuration, loading label replacement, non-blocking loading mode, custom spinner variants, and the `SpinnerVariants` runtime export alias.

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Align checkbox group field layout and option typography with the latest Figma checkbox group reference in React, Vue, and firstEdition presets.

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Clarify the Dialog accessibility contract by keeping the raw `Dialog` shell non-modal by default, moving modal semantics to `DialogModal`, adding shared React/Vue modal contract coverage, strengthening focus-fallback styling, and aligning Storybook docs and stories with the actual dialog layers.

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Add `RichText` and `RichTextField` to the input family, including core contracts, preset styling, React and Vue adapters, Storybook stories, and accessibility/test coverage.

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Add the first Slider release with core recipe and accessibility mapping, firstEdition preset styling, React and Vue adapters, `SliderField` molecule wrappers, Storybook docs and stories, and test coverage.

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Add the first Spinner release with the synced `classic`, `ring`, `dual`, `dots-round`, `dots-square`, `lines`, and `cross` styles, token and custom sizing, firstEdition preset animation, React and Vue adapters, Button loading integration, `ButtonSpinner` and `EmptyStateSpinner` purpose wrappers, Storybook docs and stories, and cross-adapter contract coverage.

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Add the first Tooltip family release with the standalone `Tooltip` atom and the Figma-aligned `TooltipGroup` molecule, including core contracts, firstEdition preset styling, React and Vue adapters, Storybook docs and stories, and adapter test coverage.

- Updated dependencies [[`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56), [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56), [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56), [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56), [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56), [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56), [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56), [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56), [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56), [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56), [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56)]:
  - @marwes-ui/core@1.0.0
  - @marwes-ui/presets@1.0.0
