# Research: React Native Future Paths

## 1. What We Are Solving

We need to decide how Marwes should support React Native after the first compiler POC. The current
POC proves that firstEdition CSS can be compiled into RN style resolvers for simple families, but it
also proves that a general CSS-to-RN compiler becomes expensive when CSS relies on browser-only
features. The next step should not be one bigger implementation push; it should be several small,
sharp POCs that test different product directions.

## 2. Codebase Context

- `new-implementation-rn.md` documents the current decision point: Button, Badge, and Divider compile
  and render, but remaining families expose pseudo-elements, `:has()`, grid, animations, and native
  platform behavior.
- `REACT_NATIVE_PLAN.md` frames the earlier direction as a Marwes-owned native design IR generated
  from preset CSS plus manifests.
- `PART2_RN.md` shows how quickly the compiler grew when adding Badge and Divider: local CSS vars,
  `var()` fallbacks, inset shadow translation, logical properties, simple `calc()`, and slot splitting.
- `scripts/generate-react-native-styles.ts` is currently 1,192 lines and owns CSS parsing, IR
  generation, diagnostics, token resolution, and generated TS output.
- `packages/react-native/src/styles/generated/first-edition.ts` and
  `packages/react-native/src/styles/generated/first-edition.ir.json` are generated artifacts for the
  three POC families.
- `packages/react-native/src/components/*` currently proves the adapter shape: call core recipes, use
  `MarwesNativeProvider`, resolve native styles, render RN primitives.
- `packages/react-native/package.json` currently exports source directly for Metro development.
- `packages/react-native/tsconfig.json` currently has `rootDir: "./src"`, while repo path aliases point
  `@marwes-ui/core` at `packages/core/src/index.ts`; this makes the RN package typecheck fail until the
  build/typecheck boundary is cleaned up.

## 3. Approach Options

### Path A: Bounded Hybrid Compiler

Use the compiler only for families whose CSS maps cleanly to RN. Use hand-written native styles for
families that need native structure or behavior.

Why it can win:
- Keeps the current POC value.
- Avoids turning the compiler into a browser engine.
- Lets native components be honest where mobile UX differs from web.

Tradeoffs:
- Two style authoring modes.
- Needs a clear support matrix so users know what is compiled and what is native-authored.
- Requires discipline: the compiler must not grow just to save the architectural ideal.

POC to run:
- Add one more Tier 1 family: `Card` or `Input`.
- Add one Tier 3 family: `Checkbox` or `Radio` with hand-written native styles.
- Compare implementation size, visual fidelity, and typecheck/build complexity.

### Path B: Full CSS-to-RN Compiler

Keep CSS as the only visual source and grow the compiler until all firstEdition families compile.

Why it can win:
- Strongest sync story with web CSS.
- Strong architectural purity.
- Could become a distinctive Marwes capability if done very well.

Tradeoffs:
- Highest risk and maintenance cost.
- Requires pseudo-element rendering, animation modeling, grid translation, complex selector analysis,
  and platform-specific overrides.
- Hard to guarantee correctness without building a large compiler test suite.

POC to run:
- Pick one intentionally hard family: `Spinner`, `Skeleton`, or `Checkbox`.
- Implement exactly one missing compiler class: pseudo-elements or keyframe animation.
- Stop if the solution requires component-specific hidden logic inside the compiler.

### Path C: No Compiler, Native Theme Styles Only

Delete the CSS compiler path and write RN style functions per family from `ResolvedTheme`.

Why it can win:
- Smallest mental model.
- Easiest to debug and ship.
- Native components can use the right primitives without pretending to be web CSS.

Tradeoffs:
- Web and RN can drift.
- Requires another parity mechanism: screenshots, token contracts, or design snapshots.
- Less “magic” and less architectural novelty.

POC to run:
- Rebuild Button, Badge, Divider as `themeToXStyles()` functions.
- Measure total lines, readability, runtime cost, and visual drift against the compiled versions.

### Path D: Token Compiler, Not Style Compiler

Compile only design tokens and semantic component decisions from CSS/core, not final RN styles.
Components then use a small native style DSL or helper layer to render from those tokens.

In simple words: instead of translating CSS declarations into RN declarations, extract the design
intent: colors, sizes, radii, density, typography, state colors. The RN component owns layout.

Why it can win:
- Keeps web preset as inspiration/source for visual values.
- Avoids translating impossible CSS features.
- Produces cleaner native components than full CSS compilation.

Tradeoffs:
- Requires defining what “design intent” means per family.
- Less automatic than Path A for simple families.
- Needs strong naming and schema discipline.

POC to run:
- Generate `native-design-tokens.ts` for Button, Badge, Checkbox, Spinner.
- Use generated semantic tokens in hand-written RN components.
- Compare against current generated resolver output.

### Path E: Marwes Cross-Platform Recipe DSL

Move visual source of truth above CSS: define component visual recipes in a typed Marwes DSL, then
generate web CSS and RN styles from the same recipe.

In simple words: CSS stops being the source. A Marwes recipe schema becomes the source, and CSS/RN are
outputs.

Why it can win:
- Most coherent long-term cross-platform architecture.
- Can generate CSS, RN styles, docs, support matrix, and test fixtures from one source.
- Avoids reverse-engineering CSS after the fact.

Tradeoffs:
- Biggest product/architecture shift.
- Would likely require migrating firstEdition CSS into recipe data.
- Risk of building a private styling language.

POC to run:
- Do not migrate everything.
- Pick only `Badge`.
- Author `badge.recipe-style.ts` with variants and slots.
- Generate both `badge.css` and `resolveBadgeStyles()` from it.
- Compare output to current CSS and RN resolver.

### Path F: External Styling Runtime Spike

Evaluate whether NativeWind, Unistyles, Tamagui, or another RN styling system can carry enough of the
native styling burden.

Why it can win:
- Leverages existing ecosystem work.
- May provide better platform behavior, performance, and developer tooling than custom compiler work.
- Could reduce Marwes maintenance surface.

Tradeoffs:
- Adds dependency and bundler assumptions.
- May force Marwes into another project's styling model.
- Could make package installability more fragile.

POC to run:
- Build the same three components with one external runtime.
- Measure setup friction in Expo monorepo, theme mapping, variant ergonomics, and generated bundle
  impact.
- Treat this as research, not adoption, unless it clearly beats owned code.

### Path G: Native-First Product Kit

Accept that RN is not parity-first. Build `@marwes-ui/react-native` as a native product kit that uses
Marwes core contracts and theme tokens, but ships mobile-native UX for hard components.

In simple words: users get Marwes taste and contracts, not a literal port of web components.

Why it can win:
- Best user experience for Select, Date Picker, Dialog, Toast, Tooltip, Slider.
- Lets RN use platform patterns instead of web metaphors.
- Could make the RN package feel premium rather than compromised.

Tradeoffs:
- Lower visual/structural parity with web.
- Needs separate RN docs and support matrix.
- Requires product decisions, not just engineering decisions.

POC to run:
- Build a native `Select` or `Dialog` using Marwes tokens and core naming/a11y intent.
- Validate the result in Expo iOS/web and compare against web API expectations.

### Path H: Visual Parity Harness First

Before choosing the final implementation architecture, build a validation harness that compares web
and RN outputs visually and structurally.

Why it can win:
- Makes future decisions evidence-based.
- Helps Path C or G avoid unchecked drift.
- Helps Path A/B catch compiler regressions.

Tradeoffs:
- Does not itself solve styling.
- Requires screenshot infrastructure and tolerance rules.

POC to run:
- Render Button, Badge, Divider in web Storybook and Expo web with the same props/theme.
- Capture screenshots and produce a small parity report.
- Add a manual iOS screenshot checklist for native-only behavior.

**Recommended:** Run Path H first as the measurement layer, then run three parallel implementation
POCs: Path A hybrid, Path D token compiler, and Path E recipe DSL. Keep Path C as the simplicity
baseline and Path F as an external reality check.

## 4. What Needs to Be Built

Research POC set:

1. Measurement POC: visual parity harness for current Button, Badge, Divider.
2. Hybrid POC: one clean compiled family plus one native-authored hard family.
3. Token compiler POC: generate semantic native design tokens instead of full styles.
4. Recipe DSL POC: single-family source-of-truth above CSS, generating both CSS and RN output.
5. External runtime POC: one Expo spike with NativeWind, Unistyles, or Tamagui.
6. Native-first product POC: one hard mobile component such as Select, Dialog, or Spinner.

Core cleanup before judging any path:

- Fix RN package typecheck boundary.
- Decide whether generated IR JSON is kept, moved to artifacts, or removed.
- Make `native-styles:check` part of the evidence, but not the only evidence.
- Define a support matrix format for component families: compiled, token-generated, native-authored,
  unsupported, or platform-specific.

## 5. Test Strategy

- `pnpm native-styles:check` must stay green for compiler-based POCs.
- `pnpm --filter @marwes-ui/react-native typecheck` must pass before any POC is considered viable.
- Expo playground must render each POC component in light mode, dark mode, custom theme, disabled
  state, and at least one interaction state.
- For compiler/token/DSL paths, generated output should be checked in or snapshotted so drift is
  visible.
- For visual parity, capture web and RN web screenshots with the same props and theme.
- For native-first hard components, test behavior and accessibility semantics before visual parity.

## 6. Risks and Open Questions

- Do we want RN to promise visual parity, design-token parity, or product-experience parity?
- Is firstEdition CSS meant to remain the long-term source of truth, or can a future Marwes recipe DSL
  become the source?
- Are we willing to ship a mixed architecture if it is clearer for users and maintainers?
- Which external RN styling runtime is worth the first spike?
- How much native UX divergence is acceptable for Select, Dialog, Date Picker, Tooltip, and Toast?
- Should `@marwes-ui/react-native` support React Native Web as a first-class target or only as a
  development/preview target?

---
Ready to proceed to spec? Confirm to continue.
