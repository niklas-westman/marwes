# React Native Architecture Readiness Validation

Created: 2026-05-12

## 1. Purpose

This document validates all proposed React Native architecture paths before deeper implementation.
It is not the final post-implementation comparison. It is a readiness report: which paths look most
compatible with Marwes today, which ones are worth implementing as POCs, and which ones should be
kept as strategic experiments only.

The current implementation baseline proves Button, Badge, and Divider can render through a
CSS-to-RN compiler. The readiness question is broader:

> Which architecture gives Marwes the best chance to build excellent React Native support without
> creating a fragile browser-reimplementation project?

## 2. Baseline Evidence

Current baseline:

- Branch: `rn-poc/baseline`
- Current commit when this report was written: `a54373a`
- Current supported RN POC families: Button, Badge, Divider
- Current worktree: `/Users/niklaswestman/Documents/extras-projects/marwes-project-folder/marwes`

Current measured line counts:

| Area | Lines |
|---|---:|
| CSS-to-RN compiler | 1,252 |
| Generated RN TS output | 2,118 |
| Generated IR JSON | 1,955 |
| RN Button component | 95 |
| RN Badge component | 56 |
| RN Divider component | 79 |

Current validation:

| Command | Status |
|---|---|
| `pnpm native-styles:check` | Pass |
| `pnpm --filter @marwes-ui/react-native typecheck` | Pass |

Important interpretation:

- The baseline is technically viable.
- The component files are small.
- The compiler and generated output are already much larger than the component adapter layer.
- The compiler has already accumulated meaningful feature work for only three families.

## 3. CSS Reality Check

The firstEdition CSS source contains many browser-specific patterns that are expensive or dishonest
to compile into React Native.

Measured across `packages/presets/src/firstEdition`:

| Pattern | Count |
|---|---:|
| Combined hard CSS patterns | 140 |
| `::before` / `::after` | 14 |
| `:has(...)` | 31 |
| `display: grid` | 23 |
| `@keyframes` / `animation` | 48 |
| `calc(...)` | 48 |

Highest-risk CSS files by hard-pattern count:

| File | Count | Meaning |
|---|---:|---|
| `spinner.css` | 35 | Animation-heavy; poor fit for CSS compilation |
| `molecules/input-field.css` | 17 | `:has()` and wrapper-state complexity |
| `date-picker.css` | 9 | Grid and pseudo-elements |
| `skeleton.css` | 8 | Animation and pseudo-elements |
| `rich-text.css` | 8 | DOM-specific `:has()` and placeholder pseudo-element |
| `checkbox-field.css` | 7 | Field wrapper state and `:has()` |
| `checkbox-group-field.css` | 6 | Grouped field state complexity |
| `dialog.css` | 6 | Viewport sizing and native modal behavior mismatch |

Conclusion:

The CSS source is a strong web design source, but it is not a clean universal native source. A full
compiler path would need to model pseudo-elements, selector parent queries, CSS grid, animations,
and native platform behavior. That is the core constraint behind every recommendation below.

## 4. Scoring Model

Scores use 1-5:

- 5 = strong
- 4 = good
- 3 = workable but risky
- 2 = weak fit
- 1 = poor fit

Criteria:

| Criterion | Meaning |
|---|---|
| Integration | Fits current Marwes architecture with minimal disruption |
| Simplicity | Easy to understand, debug, and extend |
| Code count outlook | Expected authored/generated/config code burden |
| Complexity control | Ability to avoid runaway abstractions |
| Native UX | Ability to produce components that feel right in RN |
| Drift control | Ability to keep web/RN aligned enough over time |

## 5. Score Matrix

| Path | Integration | Simplicity | Code count outlook | Complexity control | Native UX | Drift control | Total |
|---|---:|---:|---:|---:|---:|---:|---:|
| A. Hybrid compiler | 5 | 3 | 3 | 3 | 4 | 4 | 22 |
| B. Compiler for all | 2 | 1 | 1 | 1 | 2 | 5 | 12 |
| C. Handwritten native | 5 | 5 | 4 | 5 | 4 | 2 | 25 |
| D. Token compiler | 5 | 4 | 3 | 4 | 4 | 4 | 24 |
| E. Recipe DSL | 3 | 2 | 2 | 2 | 4 | 5 | 18 |
| F. External runtime | 3 | 3 | 3 | 2 | 3 | 3 | 17 |
| G. Native-first kit | 4 | 3 | 3 | 4 | 5 | 2 | 21 |
| H. Parity harness | 5 | 4 | 4 | 5 | 3 | 5 | 26 |

How to read this:

- H scores highest because it is a validation layer, not a full implementation architecture. It should
  support the real path, not replace it.
- C scores highest among implementation paths for simplicity and complexity control.
- D scores best among innovative architecture paths.
- A is the best near-term continuation of the current POC.
- G should be combined with another path for hard mobile components.
- B is the least attractive path despite strong drift control because it turns Marwes into a CSS
  engine project.

## 6. Path-by-Path Validation

### Path A: Hybrid Compiler

Summary:

Use the current CSS-to-RN compiler for simple families and hand-write native styles for families that
do not compile honestly.

Readiness:

- Integration: strong. It preserves `@marwes-ui/core`, `@marwes-ui/presets`, and the adapter model.
- Simplicity: medium. Maintainers need to understand both compiler output and native-authored styles.
- Code count: medium. Generated code grows, but only for selected families.
- Complexity: medium. The path is good only if compiler scope is deliberately capped.
- Native UX: good. Hard families can use native design instead of forced CSS translation.
- Drift control: good for compiled families, weaker for native-authored families.

Best use:

- Button, Badge, Card, Input, Textarea, Typography, Spacing, StatTile.
- Possibly Divider/Switch/Tab as partial compiler plus component-owned native structure.

Main risk:

- Compiler creep. If every hard CSS pattern becomes a compiler feature, Path A becomes Path B by
  accident.

Readiness verdict:

Ready for implementation POC. This is the safest continuation of the current baseline.

### Path B: Compiler For All Families

Summary:

Grow the compiler until all firstEdition CSS compiles to RN.

Readiness:

- Integration: weak. It keeps CSS as source, but at the cost of a large compiler subsystem.
- Simplicity: very low. Debugging becomes compiler + generated output + RN behavior.
- Code count: very high. Pseudo-elements, grid, animations, `:has()`, and platform behavior all need
  custom handling.
- Complexity: very high. This path has the clearest risk of becoming a browser-engine project.
- Native UX: weak to medium. Some components need native UX, not CSS translation.
- Drift control: high if it works, but expensive to maintain.

Best use:

- Research only. One hard-family spike could be useful to prove the cost is too high.

Main risk:

- The architecture serves the purity of "one CSS source" more than Marwes users.

Readiness verdict:

Not recommended as an implementation architecture. Keep only as a bounded negative-control spike if
needed.

### Path C: Handwritten Native

Summary:

Remove the compiler from new RN work. Use `ResolvedTheme` and small style helpers per family.

Readiness:

- Integration: strong. It keeps core recipes and theme resolution.
- Simplicity: strongest. Components are direct and readable.
- Code count: likely lowest total overhead because there is no generated style layer.
- Complexity: low. Failure modes are local to components.
- Native UX: good. Components can be designed for RN directly.
- Drift control: weak unless paired with visual parity checks or token contracts.

Best use:

- Simplicity baseline.
- Good fallback if compiler or token compiler does not prove enough value.

Main risk:

- Web/RN visual drift over time.

Readiness verdict:

Very ready as a baseline POC. It may beat A in total maintainability if visual drift can be controlled.

### Path D: Token Compiler

Summary:

Generate semantic native tokens from Marwes design intent, not final RN style objects. Components own
layout and behavior.

Readiness:

- Integration: strong. It can use CSS/core as input while avoiding browser layout translation.
- Simplicity: good if the schema stays small.
- Code count: medium. Some generator/schema work remains, but generated output should be much smaller
  than full style resolvers.
- Complexity: manageable if tokens are semantic and family-scoped.
- Native UX: good. Components can render native structure.
- Drift control: good. Web/RN share semantic design values even when structure differs.

Best use:

- Badge, Checkbox, Spinner/Skeleton POC.
- Families where colors, radius, density, typography, and state tokens matter more than exact CSS
  layout declarations.

Main risk:

- A vague token schema that grows into a second style language.

Readiness verdict:

Most promising innovative path. This is the strongest candidate to beat A if implemented carefully.

### Path E: Recipe DSL

Summary:

Move source of truth above CSS into typed Marwes style recipes, then generate both web CSS and RN
output.

Readiness:

- Integration: medium. It conflicts with the current model where firstEdition CSS is the visual source.
- Simplicity: low initially. Requires schema design, generators, and migration strategy.
- Code count: high at first.
- Complexity: high. It can become a private styling language.
- Native UX: good if recipes model platform output intentionally.
- Drift control: strongest long-term if it works.

Best use:

- One-family experiment only, preferably Badge.
- Strategic learning about future design-system source of truth.

Main risk:

- Too much architecture before Marwes knows what RN needs.

Readiness verdict:

Worth a narrow POC. Not ready as the near-term RN implementation path.

### Path F: External Runtime

Summary:

Use or test a third-party RN styling runtime such as NativeWind, Unistyles, or Tamagui.

Readiness:

- Integration: uncertain. Could fight package boundaries, Metro, Babel, or Expo.
- Simplicity: unknown. It may simplify component code while adding global setup complexity.
- Code count: potentially low, but dependency/config cost can hide complexity.
- Complexity: medium to high because Marwes inherits external constraints.
- Native UX: depends on runtime and implementation.
- Drift control: medium.

Best use:

- A short external reality check, not the default.

Main risk:

- Marwes becomes dependent on another styling model and loses control of package ergonomics.

Readiness verdict:

Run a short spike. Adopt only if it clearly beats owned code in setup, theming, variants, and
installability.

### Path G: Native-First Product Kit

Summary:

Treat React Native as a native product surface. Use Marwes tokens and core intent, but do not promise
literal web CSS or DOM structure parity for hard components.

Readiness:

- Integration: good. Core/theme still fit.
- Simplicity: medium. Individual components are direct, but product decisions are heavier.
- Code count: medium to high for hard components.
- Complexity: medium. Complexity is in real user behavior rather than compiler abstraction.
- Native UX: strongest.
- Drift control: weak for visual structure, acceptable if product-experience parity is the stated
  goal.

Best use:

- Select, Dialog, Date Picker, Toast, Tooltip, Slider, Spinner.

Main risk:

- Web and RN APIs diverge without a clear support matrix.

Readiness verdict:

Best hard-component strategy. Should be combined with A, C, or D rather than used alone for every
family.

### Path H: Visual Parity Harness

Summary:

Build validation infrastructure to compare web and RN output across themes, variants, and states.

Readiness:

- Integration: strong. It supports all implementation paths.
- Simplicity: good. It is test/evidence infrastructure.
- Code count: low to medium.
- Complexity: low if scoped to a few families first.
- Native UX: indirect. It does not build components, but helps evaluate them.
- Drift control: strongest support mechanism.

Best use:

- Mandatory support layer for A, C, D, and G.

Main risk:

- Over-investing in pixel parity for components that should diverge natively.

Readiness verdict:

Should be built early. It is the evidence layer that makes the implementation choice safer.

## 7. Best Fit For Marwes

Current best architecture direction:

```text
H: validation harness
    +
D: token compiler where semantic design extraction works
    +
G: native-first hard components
```

Pragmatic near-term delivery direction:

```text
H: validation harness
    +
A: bounded hybrid compiler
    +
G: native-first hard components
```

Simplicity fallback:

```text
H: validation harness
    +
C: handwritten native styles
    +
G: native-first hard components
```

## 8. Recommendation

The strongest Marwes path is not one pure architecture. It is a layered decision:

1. Build **Path H** first as the measurement layer.
2. Implement **Path D** as the most important innovation POC.
3. Keep **Path A** as the practical continuation of the current compiler POC.
4. Use **Path C** as the simplicity control group.
5. Use **Path G** for hard native components no matter whether A, C, or D wins.
6. Keep **Path E** narrow and strategic.
7. Keep **Path F** short and evidence-driven.
8. Do not pursue **Path B** except as a small negative-control spike.

If we had to choose today without deeper POC implementation:

**Choose A + G for near-term delivery, while trying to prove D can replace A.**

Why:

- A has the best immediate integration story because it extends the current baseline.
- G protects product quality for components where RN and web differ.
- D has the best chance to reduce compiler complexity while preserving design alignment.
- C remains the fallback if both A and D feel heavier than their value.

## 9. Implementation Order

Recommended order:

1. `rn-poc/h-parity-harness` or implement H on baseline if we do not want a separate branch.
2. `rn-poc/c-handwritten-native` to establish the simplest baseline.
3. `rn-poc/d-token-compiler` to test the best innovation candidate.
4. `rn-poc/a-hybrid-compiler` to extend the current compiler path.
5. `rn-poc/g-native-first` for a hard component.
6. `rn-poc/e-recipe-dsl` as a narrow Badge-only strategic experiment.
7. `rn-poc/f-external-runtime` as a timeboxed external check.

Rationale:

- Start with measurement.
- Establish the simplest implementation cost.
- Test the most promising better architecture.
- Then compare against the current compiler path.

## 10. Stop Criteria

Stop or downgrade a path if:

- It requires broad changes to `@marwes-ui/core` before proving value.
- It adds global runtime dependencies that make Expo/Metro setup fragile.
- It cannot pass `pnpm --filter @marwes-ui/react-native typecheck`.
- It cannot explain how one more family would be added.
- It hides platform-specific behavior behind generated code.
- It requires compiling pseudo-elements, grid, or animation systems as a default strategy.

## 11. Final Readiness Ranking

| Rank | Path | Role |
|---:|---|---|
| 1 | H. Visual parity harness | Required evidence layer |
| 2 | D. Token compiler | Best innovation candidate |
| 3 | C. Handwritten native | Best simplicity baseline |
| 4 | A. Hybrid compiler | Best near-term continuation |
| 5 | G. Native-first kit | Required hard-component strategy |
| 6 | E. Recipe DSL | Strategic future experiment |
| 7 | F. External runtime | Ecosystem reality check |
| 8 | B. Compiler for all | Not recommended |

This ranking separates infrastructure, architecture, and hard-component strategy. The practical
winner is likely a combination, not a single path.
