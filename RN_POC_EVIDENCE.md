# RN POC Evidence: Path D - Token Compiler

## Branch Identity

- Branch: `rn-poc/d-token-compiler`
- Worktree: `/Users/niklaswestman/Documents/extras-projects/marwes-project-folder/marwes-rn-d-token`
- Baseline branch: `rn-poc/baseline`
- Implementation start commit: `ba45844`
- POC owner: Marwes/Codex
- Date: 2026-05-12

## Implementation Summary

First implementation slice completed for Path D.

This slice moves RN `Badge` away from the generated CSS-to-RN style resolver and into a
native-friendly semantic token layer. The component now owns its native layout directly and consumes
resolved design tokens for color, radius, spacing, and typography.

The goal was not to implement all D families at once. The goal was to test whether the token contract
feels simpler before spending effort on Checkbox and Spinner.

## Component Scope

| Family | Status | Style source | Notes |
|---|---|---|---|
| Badge | Implemented first slice | `styles/native-tokens/generated/first-edition.native-tokens.ts` | Uses semantic native tokens instead of `resolveBadgeStyles()`. |
| Checkbox | Deferred | Planned native tokens | Should be next because it proves the pseudo-element case. |
| Spinner/Skeleton | Deferred | Planned native tokens | Should follow Checkbox because it proves the keyframe/animation case. |

## Changed Files

| Area | Files | Notes |
|---|---|---|
| Components | `packages/react-native/src/components/badge/badge.tsx` | Badge now resolves semantic tokens and builds RN `ViewStyle`/`TextStyle` directly. |
| Styles/tokens/compiler | `packages/react-native/src/styles/native-tokens/native-token-types.ts` | Family-scoped native token type model. |
| Styles/tokens/compiler | `packages/react-native/src/styles/native-tokens/resolve-native-token.ts` | Small resolver for theme refs and static values. |
| Styles/tokens/compiler | `packages/react-native/src/styles/native-tokens/generated/first-edition.native-tokens.ts` | Authored first-edition Badge token map. |
| Playground | None | Not touched in first slice. |
| Config/dependencies | None | No runtime or dev dependencies added. |
| Docs/evidence | `RN_POC_EVIDENCE.md`, `D_PLAN.md` | Evidence and progress updated. |

## Complexity Metrics

| Metric | Value | How measured |
|---|---:|---|
| Authored source lines | 236 | `wc -l` over Badge plus new native-token files. |
| Badge component delta | +28 / -15 | `git diff --numstat -- packages/react-native/src/components/badge/badge.tsx`. |
| Generated lines | 0 | This slice uses authored token output; no generated artifact added. |
| Existing full style resolver size | 2118 | `wc -l packages/react-native/src/styles/generated/first-edition.ts`. |
| Native token output size | 80 | `wc -l packages/react-native/src/styles/native-tokens/generated/first-edition.native-tokens.ts`. |
| Manifest/config/schema files | 3 | Token types, resolver, Badge token map. |
| New abstractions | 2 | `NativeTokenRef` model and Badge native token resolver/map. |
| Runtime dependencies added | 0 | No `package.json` changes. |

## Measurement Checklist

Recommended commands/checks:

```sh
git diff --stat rn-poc/baseline...HEAD
git diff --numstat rn-poc/baseline...HEAD
git diff --name-only rn-poc/baseline...HEAD
```

Line-count guidance:

- Count authored source separately from generated output.
- Treat files under `src/styles/generated` as generated lines.
- Treat manifests, schema files, Metro/Babel config, and package metadata as config/schema files.
- Count each new reusable helper, compiler phase, runtime resolver, DSL primitive, or style factory as
  a new abstraction.
- Count only runtime dependencies for dependency metrics; list dev-only dependencies separately in
  notes.

## Validation

| Command | Status | Notes |
|---|---|---|
| `/Users/niklaswestman/Documents/extras-projects/marwes-project-folder/marwes/node_modules/.bin/tsc -p packages/react-native/tsconfig.json --noEmit` | Pass | Equivalent direct package typecheck, used existing baseline `node_modules`. |
| `/Users/niklaswestman/Documents/extras-projects/marwes-project-folder/marwes/node_modules/.bin/biome check packages/react-native/src/components/badge packages/react-native/src/styles/native-tokens --write` | Pass | Scoped formatting/lint check for touched files. |
| `pnpm native-styles:check` | Pass | Required elevated run because `tsx` IPC is blocked by the sandbox. Output: generated native styles are up to date. |
| Expo playground | Not run | First slice did not change playground wiring. |

## Visual Parity Notes

- Light mode: expected to stay aligned for Badge tone colors because tokens resolve from the same
  `ResolvedTheme` color paths where possible.
- Dark mode: expected to follow `ResolvedTheme`; no separate mode switch is needed in the component.
- Custom theme: expected to follow theme refs for color, radius, and font family. Static spacing and
  type scale remain authored in the token map.
- Known drift: Badge padding, font size, font weight, and line height are currently authored values.
  A later extractor or shared token source would reduce this duplication.

## Native UX Notes

- Interaction quality: Badge remains static/non-interactive, so no interaction regression expected.
- Platform fit: improved. RN layout is now owned by the component instead of being reconstructed from
  CSS declarations.
- Performance concerns: low. The resolver is tiny and memoized by theme.

## Accessibility Notes

- Roles/states: unchanged from baseline, still renders `accessibilityRole="text"`.
- Labels/descriptions: unchanged, still uses `createBadgeRecipe()` for `ariaLabel`.
- Known gaps: none introduced by this slice.

## Next Component Cost

Checkbox is the right next test. Estimated cost is moderate but contained:

- Add checkbox token type and authored token map.
- Resolve size/state tokens from `ResolvedTheme`.
- Render the box, checkmark, indeterminate mark, disabled state, and invalid state natively.
- Reuse the core recipe for platform-neutral semantics.

The important point: Checkbox should not need CSS pseudo-element or CSS mask compiler support. If
that holds, D becomes much more compelling than extending Path A's compiler surface.

## Risks

- Token maps could become duplicated CSS if we encode too many layout values by hand.
- The schema could slowly become a second styling DSL if it starts accepting arbitrary style props.
- Visual parity still needs screenshot validation before D can be considered production-ready.
- Authored tokens are elegant for Badge, but we have not yet proven hard families.

## Recommendation

Continue Path D into Checkbox.

The Badge slice is meaningfully easier to explain than the generated CSS resolver path. It is also
small: 80 lines of native token output versus the existing 2118-line full style resolver. The
trade-off is that we now carry a semantic token contract that must be curated carefully.

Current judgement: D is the most promising architecture if Checkbox can prove native rendering
without compiler creep. Do not build a token generator yet. First prove Checkbox, then Spinner, then
decide whether extraction automation is worth it.
