# Spec: React Native POC Branch Matrix

## Requirements

1. Create a shared baseline branch for all React Native POCs:
   - Branch name: `rn-poc/baseline`
   - Purpose: make current RN POC buildable, measurable, and comparable.
   - Must include current Button, Badge, Divider POC state.
   - Must fix the RN package typecheck boundary before any implementation branch is judged.
   - Must provide a common evidence template for every POC branch.

2. Use separate branches or worktrees for each implementation path:
   - `rn-poc/a-hybrid-compiler`
   - `rn-poc/c-handwritten-native`
   - `rn-poc/d-token-compiler`
   - `rn-poc/e-recipe-dsl`
   - `rn-poc/f-external-runtime`
   - `rn-poc/g-native-first`

3. Prefer `git worktree` for parallel implementation and comparison:
   - Each POC should start from `rn-poc/baseline`.
   - Each POC should keep changes scoped to its branch.
   - Shared fixes discovered during POCs should be cherry-picked or merged back into `rn-poc/baseline`
     only when they are path-neutral.

4. Use a fixed comparison component set where possible:
   - `Badge`: simple visual variant and token case.
   - `Checkbox`: native-control and pseudo-element replacement case.
   - `Spinner` or `Skeleton`: animation case.
   - Existing Button and Divider may remain as baseline evidence, but they should not be the only
     comparison because they are too favorable to the current compiler POC.

5. Each POC branch must produce a local evidence document:
   - File: `RN_POC_EVIDENCE.md`
   - The evidence file must include implementation summary, changed files, measured complexity,
     validation commands, known failures, qualitative notes, and a recommendation.

6. Each POC must be judged against the same complexity matrix:
   - Authored source lines.
   - Generated lines.
   - Number of manifests/config/schema files.
   - Number of new abstractions.
   - Number of runtime dependencies.
   - Typecheck status.
   - Build or Expo bundle status.
   - Visual parity notes.
   - Native UX quality notes.
   - Maintenance burden estimate.
   - "Next component cost" estimate: what it would take to add one more family.

7. The POC process must keep product quality visible:
   - Do not judge by line count alone.
   - A path can be more code if it gives much better native UX, better maintainability, or better
     user-facing quality.
   - Hard native components should be judged by behavior and accessibility before pixel parity.

## Architecture

### Baseline Branch

`rn-poc/baseline` is the stable comparison base.

It should contain:

- Current `packages/react-native` package.
- Current Expo playground.
- Current native style generator.
- Current generated styles for Button, Badge, Divider.
- RN typecheck/build boundary cleanup.
- A reusable `RN_POC_EVIDENCE.template.md`.
- Optional visual parity harness if it can be built cheaply before the POCs.

Baseline should not decide the final architecture. It only makes the experiment fair.

### Branch Model

Each implementation branch starts from `rn-poc/baseline`.

```text
rn-poc/baseline
  -> rn-poc/a-hybrid-compiler
  -> rn-poc/c-handwritten-native
  -> rn-poc/d-token-compiler
  -> rn-poc/e-recipe-dsl
  -> rn-poc/f-external-runtime
  -> rn-poc/g-native-first
```

Recommended local layout:

```text
../marwes-rn-baseline
../marwes-rn-a-hybrid
../marwes-rn-c-handwritten
../marwes-rn-d-token
../marwes-rn-e-dsl
../marwes-rn-f-runtime
../marwes-rn-g-native-first
```

This makes it possible to run checks, count files, and inspect diffs side by side.

### POC Scope By Branch

#### A: Hybrid Compiler

Goal: Prove bounded compiler plus hand-written native styles can scale.

Implementation target:
- Keep current compiled Button, Badge, Divider.
- Add one clean compiled family: `Card` or `Input`.
- Add one native-authored hard family: `Checkbox`.

Success signal:
- Compiler does not gain broad browser-engine features.
- Native-authored family is readable and uses `ResolvedTheme`.
- Support matrix is easy to explain.

#### C: Handwritten Native

Goal: Establish the simplicity baseline.

Implementation target:
- Rebuild Badge and Checkbox using `themeToXStyles()` or equivalent helpers.
- Avoid style compiler usage for new work.
- Keep core recipes and provider model.

Success signal:
- Lowest mental model.
- Clear native code.
- Acceptable visual fidelity through shared tokens.

#### D: Token Compiler

Goal: Test whether generated semantic tokens are better than generated RN styles.

Implementation target:
- Generate or author an experimental `native-design-tokens` layer for Badge, Checkbox, and Spinner
  or Skeleton.
- Components own layout and behavior.
- Generated layer only provides semantic values: color, radius, spacing, typography, state tokens.

Success signal:
- Less compiler complexity than Path A.
- Less visual drift risk than Path C.
- Clear schema that could be expanded family by family.

#### E: Recipe DSL

Goal: Test a future source of truth above CSS.

Implementation target:
- Pick only `Badge`.
- Author one typed style recipe source.
- Generate web CSS and RN resolver or RN token output from that source.
- Compare generated web CSS against current `badge.css`.

Success signal:
- A single authored source can produce useful web and RN output.
- The recipe schema feels like Marwes, not a generic styling language.
- Migration cost is understandable.

#### F: External Runtime

Goal: Reality check against the RN ecosystem.

Implementation target:
- Pick one runtime: start with NativeWind or Unistyles unless a better candidate is chosen.
- Implement Badge, Checkbox, and Spinner or Skeleton in the Expo playground.
- Do not adopt globally; isolate the experiment.

Success signal:
- Setup is not fragile in the pnpm/Expo monorepo.
- Theme and variants are ergonomic.
- Dependency cost is justified by reduced Marwes-owned complexity.

#### G: Native-First Product Kit

Goal: Test whether the best RN value is product-experience parity rather than CSS parity.

Implementation target:
- Pick one hard mobile component: `Select`, `Dialog`, or `Spinner`.
- Build it as a polished native component using Marwes tokens and core intent.
- Do not force web DOM structure.

Success signal:
- The result feels like a good RN component, not a compromised CSS port.
- API remains recognizable to Marwes users.
- Native behavior and accessibility are credible.

### Comparison Output

After implementation, create a final comparison document from branch evidence:

- Suggested file: `RN_POC_COMPARISON.md`
- It should include a table of all branches, measured complexity, validation status, and final
  recommendation.
- It should separate "architecture winner" from "things worth stealing from losing branches".

## Acceptance Criteria

- GIVEN `rn-poc/baseline` exists WHEN a POC branch is created THEN it starts from the same baseline
  commit as the other POC branches.
- GIVEN a POC branch is complete WHEN `RN_POC_EVIDENCE.md` is opened THEN it contains the required
  complexity metrics, validation commands, failures, and recommendation.
- GIVEN a compiler-based branch WHEN `pnpm native-styles:check` runs THEN generated styles are up to
  date or the evidence file explains the failure.
- GIVEN any branch claims viability WHEN `pnpm --filter @marwes-ui/react-native typecheck` runs THEN it
  passes or the evidence file marks the path as blocked.
- GIVEN any branch implements visual components WHEN the Expo playground runs THEN Badge plus at least
  one hard component can be manually inspected in light and dark mode.
- GIVEN all selected POCs are complete WHEN `RN_POC_COMPARISON.md` is written THEN it recommends one
  primary path, one fallback path, and any reusable ideas from other paths.

## Out of Scope

- Shipping `@marwes-ui/react-native`.
- Full parity for all firstEdition families.
- Publishing packages.
- Choosing permanent external runtime dependencies before the external runtime spike is measured.
- Building native Storybook.
- Solving iOS, Android, and React Native Web parity for every hard component.
- Migrating all web CSS to a recipe DSL.

---
Ready to proceed to tickets? Confirm to continue.
