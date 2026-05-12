# React Native POC Guide And Validation

Created: 2026-05-11

## 1. Where The POCs Live

All React Native POC branches were created from the shared implementation baseline commit:

- Baseline branch: `rn-poc/baseline`
- POC start commit: `16a5621`
- Baseline worktree: `/Users/niklaswestman/Documents/extras-projects/marwes-project-folder/marwes`
- Full readiness report: `RN_ARCHITECTURE_READINESS_VALIDATION.md`

| Path | Branch | Worktree | Purpose | Current status |
|---|---|---|---|---|
| Baseline | `rn-poc/baseline` | `/Users/niklaswestman/Documents/extras-projects/marwes-project-folder/marwes` | Current RN compiler POC plus validation setup | Ready |
| A | `rn-poc/a-hybrid-compiler` | `/Users/niklaswestman/Documents/extras-projects/marwes-project-folder/marwes-rn-a-hybrid` | Keep compiler for clean families, hand-write hard native families | Evidence placeholder ready |
| C | `rn-poc/c-handwritten-native` | `/Users/niklaswestman/Documents/extras-projects/marwes-project-folder/marwes-rn-c-handwritten` | No compiler for new work; native theme style functions | Evidence placeholder ready |
| D | `rn-poc/d-token-compiler` | `/Users/niklaswestman/Documents/extras-projects/marwes-project-folder/marwes-rn-d-token` | Generate semantic native design tokens, not full RN style objects | Evidence placeholder ready |
| E | `rn-poc/e-recipe-dsl` | `/Users/niklaswestman/Documents/extras-projects/marwes-project-folder/marwes-rn-e-dsl` | Test a typed Marwes style recipe source that can output web CSS and RN output | Evidence placeholder ready |
| F | `rn-poc/f-external-runtime` | `/Users/niklaswestman/Documents/extras-projects/marwes-project-folder/marwes-rn-f-runtime` | Test NativeWind, Unistyles, or similar external RN styling runtime | Evidence placeholder ready |
| G | `rn-poc/g-native-first` | `/Users/niklaswestman/Documents/extras-projects/marwes-project-folder/marwes-rn-g-native-first` | Build a hard component as a premium native-first Marwes component | Evidence placeholder ready |

Each POC worktree contains:

- `RN_POC_EVIDENCE.md`
- the same baseline code at the starting point
- its own branch, so implementation can diverge safely

## 2. How To Work In A POC

Example:

```sh
cd /Users/niklaswestman/Documents/extras-projects/marwes-project-folder/marwes-rn-a-hybrid
git status --short
```

Recommended validation commands per POC:

```sh
pnpm native-styles:check
pnpm --filter @marwes-ui/react-native typecheck
pnpm exec biome check apps/playground-react-native packages/react-native scripts/generate-react-native-styles.ts
```

In this environment, `pnpm native-styles:check` may need elevated execution because `tsx` creates an
IPC pipe under `/var/folders`.

## 3. Baseline Facts

Current baseline implementation:

| Area | Lines |
|---|---:|
| Compiler: `scripts/generate-react-native-styles.ts` | 1,252 |
| Generated TS: `packages/react-native/src/styles/generated/first-edition.ts` | 2,118 |
| Generated IR JSON: `packages/react-native/src/styles/generated/first-edition.ir.json` | 1,955 |
| RN Button component | 95 |
| RN Badge component | 56 |
| RN Divider component | 79 |

Baseline validation status:

| Command | Status |
|---|---|
| `pnpm native-styles:check` | Pass |
| `pnpm --filter @marwes-ui/react-native typecheck` | Pass |
| Biome check for RN/playground/generator | Pass |
| Expo manual visual validation | Pending |

Important baseline interpretation:

- The existing compiler POC proves technical feasibility for Button, Badge, and Divider.
- The current generated output is larger than the authored RN components.
- The compiler already needed support for token fallback parsing, local CSS vars, color mixing,
  logical properties, simple `calc()`, View/Text slot splitting, and generated rule typing.
- The current POCs beyond baseline are not implemented yet, so the validation below is an
  architecture-readiness assessment, not final empirical evidence.

## 4. Validation Criteria

Each path should be judged on these dimensions:

| Dimension | What good looks like |
|---|---|
| Integration possibility | Fits current Marwes core/presets/adapters without forcing broad rewrites |
| Simplicity | Easy for a maintainer to understand and add one more component |
| Code count | Low authored code plus low generated/config overhead, without hiding complexity |
| General complexity | Few moving parts, few custom rules, predictable failure modes |
| Native UX quality | RN components feel native rather than like compromised web ports |
| Drift control | Web and RN stay aligned through tokens, generated artifacts, tests, or visual evidence |

## 5. Current Path Assessment

### Path A: Hybrid Compiler

Expected integration: High

Why:

- It preserves current Marwes structure: core recipes stay shared, presets remain useful, RN adapter
  stays a dedicated package.
- It does not require a full migration away from CSS.
- It allows native-authored components where RN differs fundamentally.

Expected simplicity: Medium

- Simple for Tier 1 families.
- More complex than handwritten styles because the system has two style paths.
- Still explainable if the support matrix is strict.

Expected code count: Medium

- Compiler remains around current size if bounded.
- Generated output grows only for compiled families.
- Native-authored hard families avoid adding browser-engine features.

General complexity: Medium

- Main risk is compiler creep.
- Best mitigation: a hard rule that pseudo-elements, grid, and animation systems do not enter the
  compiler unless a future POC proves they are cheap.

Current fit for Marwes: Strongest near-term fit.

### Path C: Handwritten Native

Expected integration: High

Why:

- Reuses `@marwes-ui/core` and `ResolvedTheme`.
- Avoids compiler-specific build complexity.
- Easy to package and reason about.

Expected simplicity: Very high

- Lowest mental model.
- Components can be read directly.

Expected code count: Low to medium

- Per component likely 50-150 authored lines.
- No generated style output.
- No manifests.

General complexity: Low

- Main risk is visual drift from web.
- Needs a strong visual/token validation harness.

Current fit for Marwes: Best fallback if the team decides exact CSS sync is not worth compiler cost.

### Path D: Token Compiler

Expected integration: High

Why:

- Uses existing presets/core as input but avoids translating full CSS layout.
- Lets RN components own native structure.

Expected simplicity: Medium-high

- More moving parts than C, less than A.
- Requires a clear schema for semantic native tokens.

Expected code count: Medium

- Smaller generated output than full style resolver.
- Some schema/compiler code required.
- Native components still need authored layout.

General complexity: Medium-low if schema stays small

- Best balance if we want web/RN alignment without compiling browser behavior.
- Risk is inventing a vague middle layer that becomes hard to define per family.

Current fit for Marwes: Most interesting innovation path.

### Path E: Recipe DSL

Expected integration: Medium

Why:

- Could become the cleanest long-term source of truth.
- But it changes the current Marwes source model because CSS stops being primary.

Expected simplicity: Low at first, potentially high later

- Hard migration and schema-design work upfront.
- Could become elegant if it proves itself on Badge.

Expected code count: High initially

- Needs recipe schema, generator, web CSS output, RN output, and diff validation.

General complexity: High

- Biggest architectural shift.
- Risk of building a private styling language.

Current fit for Marwes: Worth one narrow POC, not a near-term default.

### Path F: External Runtime

Expected integration: Medium to low until proven

Why:

- Could reduce owned styling work.
- But may impose Babel/Metro/runtime assumptions that conflict with clean package installability.

Expected simplicity: Unknown

- Simple if the runtime fits.
- Fragile if it fights monorepo, theming, or package boundaries.

Expected code count: Potentially low authored code, but dependency/config cost may be high.

General complexity: Unknown to high

- External abstraction can hide complexity rather than remove it.

Current fit for Marwes: Useful reality check, not a default architecture.

### Path G: Native-First Product Kit

Expected integration: Medium-high

Why:

- Keeps Marwes core intent and theme tokens.
- Accepts that Select, Dialog, Date Picker, Toast, Tooltip, Slider, and Spinner may need native product
  decisions.

Expected simplicity: Medium

- Straightforward per component, but product/API decisions are heavier.

Expected code count: Medium to high per hard component

- Native behavior costs real code.
- But the code directly serves user experience instead of compiler abstraction.

General complexity: Medium

- Main risk is drifting too far from Marwes web API.
- Best mitigation: document which components promise product-experience parity instead of DOM/CSS
  parity.

Current fit for Marwes: Best path for hard mobile components, likely combined with A or D.

## 6. Current Recommendation

Before implementing all POCs, the strongest expected architecture is:

1. **Primary near-term path: Path A, Hybrid Compiler**
2. **Innovation path to test seriously: Path D, Token Compiler**
3. **Simplicity baseline/fallback: Path C, Handwritten Native**
4. **Hard-component strategy: Path G, Native-First Product Kit**
5. **Long-term strategic experiment: Path E, Recipe DSL**
6. **External reality check: Path F, External Runtime**

Best current fit for Marwes:

**Path A + Path G**, with Path D as the most promising improvement candidate.

Why:

- Path A preserves the current POC value without forcing every family through the compiler.
- Path G acknowledges that some RN components should be excellent native components, not web-CSS
  translations.
- Path D may become the better version of A if it proves that semantic token generation gives enough
  alignment with much less compiler weight.

What would change the recommendation:

- If Path C produces excellent visual fidelity with much less code, choose C as the main path.
- If Path D can cover Badge, Checkbox, and Spinner/Skeleton with a small schema, prefer D over A.
- If Path E can generate current Badge CSS and RN output cleanly from one source, consider it for a
  future Marwes v2 design-source migration, not immediate RN delivery.
- If Path F removes major complexity without hurting installability, reconsider owned compiler work.

## 7. What A Full Empirical Validation Still Requires

The branch matrix is ready, but the POCs are not implemented yet. A final evidence-based decision
requires:

1. Implement A, C, D, and E at minimum.
2. Fill `RN_POC_EVIDENCE.md` in each implemented branch.
3. Run the same validation commands in each branch.
4. Count authored lines, generated lines, manifests/config/schema files, abstractions, and dependency
   deltas.
5. Build `RN_POC_COMPARISON.md` from the evidence.

Until then, this document is the current architecture-readiness report, not the final post-POC
verdict.
