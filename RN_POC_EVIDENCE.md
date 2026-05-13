# RN POC Evidence: Path D - Token Compiler

## Branch Identity

- Branch: `rn-poc/d-token-compiler`
- Worktree: `/Users/niklaswestman/Documents/extras-projects/marwes-project-folder/marwes-rn-d-token`
- Baseline branch: `rn-poc/baseline`
- Implementation start commit: `ba45844`
- POC owner: Marwes/Codex
- Date: 2026-05-12

## Implementation Summary

Badge, Checkbox, Spinner, and the first preset-sourced native token extractor slice are complete for
Path D.

The first slice moved RN `Badge` away from the generated CSS-to-RN style resolver and into a
native-friendly semantic token layer. The second slice adds RN `Checkbox` with native rendering for
checked, mixed, invalid, and disabled states.

The key Checkbox result: D did not need pseudo-elements, CSS masks, or extra compiler surface. The
component owns the mark rendering with React Native primitives while core still supplies the
platform-neutral recipe/a11y contract.

The key extractor result: Badge and Checkbox token data now comes from explicit variables in
`@marwes-ui/presets`, not from a handwritten RN token map. The extractor is whitelist-based and does
not translate layout declarations, pseudo-elements, masks, or keyframes.

The key Spinner result: D can render motion with React Native `Animated` primitives from preset
tokens. Spinner uses core for variant/size/a11y, preset variables for colors/duration, and RN-owned
animation instead of CSS keyframe translation.

## Component Scope

| Family | Status | Style source | Notes |
|---|---|---|---|
| Badge | Implemented first slice | `styles/native-tokens/generated/first-edition.native-tokens.ts` | Uses semantic native tokens instead of `resolveBadgeStyles()`. |
| Checkbox | Implemented second slice | `styles/native-tokens/generated/first-edition.native-tokens.ts` | Native `Pressable`, native check/mixed mark, no pseudo-element or CSS mask model. |
| Spinner | Implemented third slice | Generated native token data from preset CSS | Native `Animated` rotation; no CSS keyframe compiler support. |
| Skeleton | Deferred | Planned native tokens | Similar extraction model, but shimmer strategy still needs a native decision. |

## Changed Files

| Area | Files | Notes |
|---|---|---|
| Components | `packages/react-native/src/components/badge/badge.tsx` | Badge now resolves semantic tokens and builds RN `ViewStyle`/`TextStyle` directly. |
| Components | `packages/react-native/src/components/checkbox/*` | Checkbox renders native box, checked mark, and mixed mark. |
| Components | `packages/react-native/src/components/spinner/*` | Spinner renders native rings/segments with `Animated` rotation. |
| Components | `packages/react-native/src/index.ts` | Exports RN Checkbox and Spinner. |
| Styles/tokens/compiler | `packages/react-native/src/styles/native-tokens/native-token-types.ts` | Family-scoped native token type model for Badge and Checkbox. |
| Styles/tokens/compiler | `packages/react-native/src/styles/native-tokens/resolve-native-token.ts` | Small resolver for theme refs and static values. |
| Styles/tokens/compiler | `scripts/generate-react-native-tokens.ts` | Strict preset-variable extractor. |
| Styles/tokens/compiler | `packages/react-native/src/styles/native-tokens/generated/first-edition.native-token-data.ts` | Generated Badge and Checkbox token data from preset CSS. |
| Styles/tokens/compiler | `packages/react-native/src/styles/native-tokens/generated/first-edition.native-tokens.ts` | Runtime token resolver over generated token data. |
| Presets | `packages/presets/src/firstEdition/badge.css`, `packages/presets/src/firstEdition/checkbox.css` | Adds explicit component variables for native extraction. |
| Playground | `apps/playground-react-native/App.tsx` | Adds D Checkbox and Spinner examples. |
| Config/dependencies | `package.json` | Adds `native-tokens:generate` and `native-tokens:check`; no dependencies added. |
| Docs/evidence | `INNOVATION_IDEA.md`, `RN_POC_EVIDENCE.md`, `D_PLAN.md` | Evidence and innovation path updated. |

## Complexity Metrics

| Metric | Value | How measured |
|---|---:|---|
| Authored source lines | 988 | `wc -l` over Badge, Checkbox, Spinner, token types/resolver, and token extractor script. |
| Playground/export lines touched | 284 | `wc -l` over playground app plus RN package index. |
| Badge component delta | +28 / -15 | `git diff --numstat -- packages/react-native/src/components/badge/badge.tsx`. |
| Checkbox component lines | 136 | `wc -l packages/react-native/src/components/checkbox/*`. |
| Spinner component lines | 255 | `wc -l packages/react-native/src/components/spinner/*`. |
| Generated token data lines | 218 | `wc -l packages/react-native/src/styles/native-tokens/generated/first-edition.native-token-data.ts`. |
| Existing full style resolver size | 2118 | `wc -l packages/react-native/src/styles/generated/first-edition.ts`. |
| Native token resolver size | 100 | `wc -l packages/react-native/src/styles/native-tokens/generated/first-edition.native-tokens.ts`. |
| Manifest/config/schema files | 4 | Token types, resolver, generated data file, package scripts. |
| New abstractions | 5 | `NativeTokenRef` model, native token resolver, preset-variable extractor, Checkbox mark helper, Spinner segment renderer. |
| Runtime dependencies added | 0 | `package.json` only adds scripts; no dependency fields changed. |

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
| `/Users/niklaswestman/Documents/extras-projects/marwes-project-folder/marwes/node_modules/.bin/biome check ... --write` | Pass | Scoped formatting/lint check for touched docs, script, CSS, generated files, and RN files. |
| `pnpm native-tokens:check` | Pass | Generated native token data is up to date. |
| `pnpm native-styles:check` | Pass | Required elevated run because `tsx` IPC is blocked by the sandbox. Output: generated native styles are up to date. |
| `pnpm test:presets` | Pass | 16 files / 44 tests passed, including Badge and Checkbox CSS contracts. |
| `pnpm --filter @marwes-ui/playground-react-native typecheck` | Blocked | The D worktree has no app-local `node_modules`; not installing packages for supply-chain safety. |
| Expo playground | Not run | Manual visual inspection still needed. |

## Visual Parity Notes

- Light mode: expected to stay aligned for Badge tone colors and Checkbox base states because tokens
  resolve from `ResolvedTheme` color paths where possible.
- Dark mode: expected to follow `ResolvedTheme`; no separate mode switch is needed in Badge or
  Checkbox.
- Custom theme: expected to follow theme refs for color, radius, and font family. Static spacing and
  type scale now come from explicit preset variables.
- Known drift: Checkbox and Badge token data are now preset-sourced. Remaining drift risk is mostly
  visual until screenshot validation is added.

## Native UX Notes

- Interaction quality: Checkbox uses native `Pressable` and controlled/uncontrolled checked state.
- Platform fit: improved. RN layout and state visuals are owned by components instead of being
  reconstructed from CSS declarations.
- Performance concerns: low. The resolver is tiny and memoized by theme.

## Accessibility Notes

- Roles/states: Badge still renders `accessibilityRole="text"`. Checkbox uses
  `accessibilityRole="checkbox"` and `accessibilityState.checked`, including `"mixed"`.
- Labels/descriptions: Badge uses `createBadgeRecipe()`. Checkbox uses `checkboxRecipe()` for labels
  and labelled-by wiring.
- Known gaps: RN does not map web `ariaDescribedBy` one-to-one here; field-level RN wrappers should
  own descriptive text semantics later.

## Next Component Cost

Skeleton is the next likely token extraction test, but it is less decisive than Spinner was.

- Extract skeleton base/highlight/radius/dimension tokens.
- Decide whether shimmer should use native animation, static fallback, or a reduced-motion strategy.
- Keep gradient/shimmer implementation RN-owned rather than compiling CSS gradients/keyframes.

The important point: Spinner did not need CSS keyframe compiler support. Checkbox already proved that
pseudo-element/mask support is not needed for the hard mark-rendering case.

## Risks

- Token maps could become duplicated CSS if extractor manifests grow beyond semantic variables.
- The schema could slowly become a second styling DSL if it starts accepting arbitrary style props.
- Visual parity still needs screenshot validation before D can be considered production-ready.
- Spinner visual parity is approximate until device/screenshot validation confirms the native
  segment geometry.

## Recommendation

Continue Path D as the primary architecture candidate.

Badge is meaningfully easier to explain than the generated CSS resolver path, and Checkbox is the
stronger signal: the hard pseudo-element/CSS-mask case became a straightforward native component.
The newest improvement is that native token data is now generated from preset variables, so D no
longer depends on hand-copied RN token values for Badge, Checkbox, or Spinner.

Current judgement: D is still the most promising architecture. The extractor should remain strict and
manifest-driven. The next decision should be visual validation, not broader compiler scope.
