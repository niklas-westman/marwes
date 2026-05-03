# @marwes-ui/react

## 1.0.3

### Patch Changes

- [#23](https://github.com/niklas-westman/marwes/pull/23) [`6a76863`](https://github.com/niklas-westman/marwes/commit/6a7686369b018c8e8738581b29526d52210996cc) Thanks [@niklas-westman](https://github.com/niklas-westman)! - adds optional global theme-mode synchronization

- Updated dependencies [[`6a76863`](https://github.com/niklas-westman/marwes/commit/6a7686369b018c8e8738581b29526d52210996cc)]:
  - @marwes-ui/presets@1.0.3
  - @marwes-ui/core@1.0.3

## 1.0.2

### Patch Changes

- [#21](https://github.com/niklas-westman/marwes/pull/21) [`63b33bc`](https://github.com/niklas-westman/marwes/commit/63b33bc8ffd47854869153df46cab24334ff954f) Thanks [@niklas-westman](https://github.com/niklas-westman)! - adding system theme support

- Updated dependencies [[`63b33bc`](https://github.com/niklas-westman/marwes/commit/63b33bc8ffd47854869153df46cab24334ff954f)]:
  - @marwes-ui/presets@1.0.2
  - @marwes-ui/core@1.0.2

## 1.0.1

### Patch Changes

- [#19](https://github.com/niklas-westman/marwes/pull/19) [`0920746`](https://github.com/niklas-westman/marwes/commit/09207469a0502f72784cbde1c9e3cba9799fac95) Thanks [@niklas-westman](https://github.com/niklas-westman)! - clarify theme toggle and update readme

- Updated dependencies [[`0920746`](https://github.com/niklas-westman/marwes/commit/09207469a0502f72784cbde1c9e3cba9799fac95)]:
  - @marwes-ui/presets@1.0.1
  - @marwes-ui/core@1.0.1

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

## 0.0.4

### Patch Changes

- [#12](https://github.com/niklas-westman/marwes/pull/12) [`afdb19e`](https://github.com/niklas-westman/marwes/commit/afdb19edd7c3620a895f3a83d7b670497b3f60a0) Thanks [@niklas-westman](https://github.com/niklas-westman)! - button and input purpose components setup

- Updated dependencies [[`afdb19e`](https://github.com/niklas-westman/marwes/commit/afdb19edd7c3620a895f3a83d7b670497b3f60a0)]:
  - @marwes-ui/presets@0.0.4
  - @marwes-ui/core@0.0.4

## 0.0.3

### Patch Changes

- [#9](https://github.com/niklas-westman/marwes/pull/9) [`c5e3b1a`](https://github.com/niklas-westman/marwes/commit/c5e3b1a1368556f9afbb1a0a9f9fca94a58e5e1d) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Initial package release attempt

- Updated dependencies [[`c5e3b1a`](https://github.com/niklas-westman/marwes/commit/c5e3b1a1368556f9afbb1a0a9f9fca94a58e5e1d)]:
  - @marwes-ui/core@0.0.3
  - @marwes-ui/presets@0.0.3

## 0.0.2

### Patch Changes

- [#7](https://github.com/niklas-westman/marwes/pull/7) [`94d3da8`](https://github.com/niklas-westman/marwes/commit/94d3da847f7a631b0dff918b8a6104360a1c425b) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Initial release

- Updated dependencies [[`94d3da8`](https://github.com/niklas-westman/marwes/commit/94d3da847f7a631b0dff918b8a6104360a1c425b)]:
  - @marwes-ui/presets@0.0.2
  - @marwes-ui/core@0.0.2

## 0.0.2

### Patch Changes

- [#5](https://github.com/niklas-westman/marwes/pull/5) [`4f4bea6`](https://github.com/niklas-westman/marwes/commit/4f4bea6dc8a36144f8f1852992ed280686ea7494) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Rename packages from @marwes to @marwes-ui

- Updated dependencies [[`4f4bea6`](https://github.com/niklas-westman/marwes/commit/4f4bea6dc8a36144f8f1852992ed280686ea7494)]:
  - @marwes-ui/presets@0.0.2
  - @marwes-ui/core@0.0.2
