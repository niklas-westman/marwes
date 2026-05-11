# React Native Implementation — Findings & Path Forward

Status: POC complete, decision point
Branch: `react-native-evaluation`

## What We Built

A CSS-to-RN compiler that reads `@marwes-ui/presets` firstEdition CSS files, combines them
with native style manifests, and generates typed React Native style resolvers. Three components
(Button, Badge, Divider) render in an Expo playground using generated styles from the same
CSS source as web.

### Architecture

```
button.css ─┐                        ┌─→ resolveButtonStyles()
badge.css  ─┤→ PostCSS + manifests ──┤─→ resolveBadgeStyles()   → RN components → Expo
divider.css ┘                        └─→ resolveDividerStyles()
```

### Files Created

| Area | Files | Lines |
|---|---|---|
| Compiler | `scripts/generate-react-native-styles.ts` | 1 192 |
| Generated output | `first-edition.ts` + `first-edition.ir.json` | 4 087 |
| Package source (components, provider, context, manifests) | 12 files | 2 438 |
| Expo playground | `apps/playground-react-native/` | ~200 |

### Compilation Results

| Family | CSS lines | Generated rules | Errors | Warnings | Ignored |
|---|---|---|---|---|---|
| Button | 219 | 53 | 0 | 0 | 9 |
| Badge | 107 | 23 | 0 | 0 | 2 |
| Divider | 37 | 3 | 0 | 0 | 3 |

## Honest Assessment

### What works

1. **The vertical slice is proven.** CSS compiles to RN styles. Theme tokens resolve at
   runtime. Components render with correct colors, variants, sizes, and dark mode.

2. **Core stays untouched.** No changes to `@marwes-ui/core`. The RN adapter uses the same
   `createButtonRecipe()` / `createBadgeRecipe()` / `createDividerRecipe()` as React/Vue/Svelte.

3. **Preset CSS stays the source of truth.** No hand-written native style objects.

### What concerns me

**The compiler is doing too much work for too little payoff.**

Here are the numbers that matter:

| | React adapter (Badge) | RN adapter (Badge) |
|---|---|---|
| Component file | 28 lines | 51 lines |
| Needs compiler? | No — CSS class applied directly | Yes — 1 192-line compiler + manifest |
| Needs generated output? | No | Yes — 4 087 lines of IR + resolver |
| Bugs hit during POC | 0 | 6 (slot split, inherit, flexDirection, color leak, divider clip, React dual) |

The React adapter is thin because the browser does the hard work: CSS cascade handles
variants, pseudo-classes handle states, custom properties handle theming. The compiler
exists solely to replicate what the browser gives us for free.

**Every CSS pattern we hit required a new compiler feature:**

| CSS pattern | Compiler work needed |
|---|---|
| `var(--mw-token)` | Token map + runtime resolver |
| `var(--token, fallback)` | Fallback parsing + tokenWithFallback IR node |
| `--mw-badge-surface: ...` (component-local vars) | Two-pass compilation: collect scopes → re-resolve |
| `color-mix(in srgb, ...)` | Color-mix parser + runtime alpha blend |
| `box-shadow: inset 0 0 0 1px` | Special-case border translation |
| `display: inline-flex` | Must emit `flexDirection: row` (CSS/RN default mismatch) |
| `background-clip: content-box` | Cannot compile — Divider needed manual component rewrite |
| `inherit` / `initial` | Filter in parseValue + var-fallback handling |
| `calc(...)` | Expression evaluator |
| `inline-size` / `block-size` | Logical property mapping |
| View vs Text slot split | 30+ prop classification set |

And this is only Button, Badge, and Divider — the three simplest families.

**Looking at what remains:**

| Family | Blockers for compiler |
|---|---|
| Checkbox | `::before`/`::after` pseudo-elements (3), `calc()` |
| Radio | `::before`/`::after` (5) |
| Select | 376 lines, `:has()` (3), complex descendant selectors |
| Date Picker | `display: grid` (7), `::before`/`::after` (2) |
| Spinner | `calc()` (24 uses), animation keyframes |
| Toast | 348 lines, 142 var references, `::before` |
| Rich Text | `:has()` (6), `::before` |
| Skeleton | `::before`/`::after` (2), animation |

These families cannot be compiled with the current approach. The compiler would need to
grow substantially — pseudo-element rendering, grid layout translation, animation systems —
and at that point it stops being a CSS compiler and starts being a browser engine.

### The core tension

Marwes web adapters are thin because they delegate to the browser. The CSS compiler tries
to be the browser. That is fundamentally expensive and fragile.

The question is not "can we make the compiler work?" — we can, with enough effort. The
question is: **does this complexity serve Marwes users, or does it serve an architectural
ideal?**

## Recommendation

**Keep the compiler for the narrow set of families where it works cleanly. Write native
styles directly for families where CSS patterns cannot compile honestly.**

This is not "give up on compiled styles." It is "use the right tool for each family."

### Tier 1: Compiler works well

These families have simple CSS — mostly `var()` tokens, color-mix, basic selectors. The
compiler adds real value because it keeps styles in sync with web presets automatically.

- **Button** — proven, works
- **Badge** — proven, works (via two-pass local var resolution)
- **Card** — similar to Button (var tokens, color-mix, no pseudo-elements)
- **Input** — simple (var tokens, no pseudo-elements)
- **Textarea** — simple (similar to Input)
- **Typography** (Heading/Paragraph) — trivial (font tokens only)
- **Spacing** — trivial (single var)
- **StatTile** — simple (var tokens, no pseudo-elements)

### Tier 2: Compiler partial, component fills gaps

These families have some compilable CSS but also patterns that need native solutions.

- **Divider** — already proven: compiled color, component-owned spacing
- **Switch** — 156 lines, heavy local vars but no pseudo-elements; compilable with
  component-level track/thumb rendering
- **Tab** — 81 lines, color-mix; tab indicator needs native approach
- **Accordion** — 140 lines, local vars; expand/collapse needs Animated API

### Tier 3: Hand-written native styles

These families use CSS features that cannot compile to RN honestly. Native styles should
be written directly, using theme tokens from `ResolvedTheme`.

- **Checkbox** — pseudo-element checkmark, needs SVG or custom rendering
- **Radio** — pseudo-element dot, needs custom rendering
- **Spinner** — 24 `calc()` expressions, CSS animations → RN Animated
- **Skeleton** — pseudo-element overlay, CSS animation → RN Animated
- **Select** — 376 lines, `:has()`, complex structure → native picker/modal
- **Dialog** — RN `Modal`, focus trap, back button → platform-specific
- **Toast** — 348 lines, pseudo-element, portal/overlay → native approach
- **Tooltip** — mobile semantics differ fundamentally
- **Date Picker** — CSS grid, pseudo-elements → native date module
- **Rich Text** — `:has()`, DOM-specific → dedicated RN editor
- **Slider** — complex calc, pseudo-elements → native slider or custom

### What this means for the compiler

The compiler stays, but its scope is bounded:

- It handles **~10 families** cleanly (Tier 1)
- It provides **base colors and tokens** for ~4 more (Tier 2)
- It is **not used** for ~11 families (Tier 3) — those use `ResolvedTheme` directly

This means the compiler does not need to grow into a CSS engine. It stays at roughly its
current complexity (1 200 lines) and handles the subset it handles well.

### What this means for component authoring

For Tier 3 families, the component file would look like:

```tsx
function Checkbox({ checked, ...options }: NativeCheckboxProps) {
  const { theme } = useMarwesTheme()
  const kit = createCheckboxRecipe(options)

  return (
    <Pressable
      style={{
        width: 18,
        height: 18,
        borderRadius: theme.ui.radius,
        borderWidth: 1,
        borderColor: checked ? theme.color.primary.base : theme.color.border,
        backgroundColor: checked ? theme.color.primary.base : "transparent",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {checked && <CheckIcon color={theme.color.primary.label} size={12} />}
    </Pressable>
  )
}
```

This is honest, readable, and uses the same theme tokens. It does not pretend to compile
from CSS. It does not need a manifest, a two-pass resolver, or an IR format.

## Simplification Opportunities

### 1. Drop the IR JSON file

The `first-edition.ir.json` (2 000 lines) is not used at runtime. It was designed for
debugging and CI checks. For the POC, the generated `.ts` file is sufficient. Remove
the JSON to halve generated output.

### 2. Inline the token resolver

The token resolver maps `--mw-color-primary-base` → `theme.color.primary.base`. This
is a lookup table generated into the output file. An alternative: generate style functions
that reference `theme` properties directly instead of going through a string-keyed map.

Before (current):
```ts
{ kind: "token", prop: "backgroundColor", token: "--mw-color-primary-base" }
// resolved at runtime via tokenMap["--mw-color-primary-base"]
```

After (direct):
```ts
root: { backgroundColor: theme.color.primary.base }
```

This would make the generated output smaller, faster, and more readable. The tradeoff is
that the compiler needs to know the `ResolvedTheme` shape at generation time, but it
already does (it builds the token map from it).

### 3. Simplify manifests

Current manifests declare slots, selectors, variants, states, and ignored declarations.
For Tier 1 families where the compiler works cleanly, this is fine. But the manifest
should not grow to compensate for CSS the compiler cannot handle.

### 4. Consider whether the compiler should exist at all

An honest alternative: write a `themeToButtonStyles(theme, variant, size, state)` function
by hand. For Button, this would be ~80 lines. Readable. No compiler. No manifest. No IR.
No two-pass resolution. No slot-split logic. Uses the same `ResolvedTheme`.

The compiler's value proposition is: "styles stay in sync with web CSS automatically."
But in practice, every new CSS pattern required a compiler feature. The "automatic" sync
is manual compiler work with a layer of indirection.

**If the team decides the sync guarantee is worth the compiler complexity, keep it for
Tier 1. If not, hand-written theme-based styles are simpler and equally correct.**

## Metro / Monorepo Setup

These findings are independent of the compiler decision:

### pnpm workspace + Expo requires specific Metro config

```js
// metro.config.js — required for pnpm monorepo
config.resolver.disableHierarchicalLookup = true
config.resolver.extraNodeModules = new Proxy({}, {
  get: (_, name) => {
    // resolve from playground first, then monorepo root
  }
})
```

Without `disableHierarchicalLookup`, workspace packages resolve `react` to the root
version (19.2.4) instead of Expo's version (19.1.0). This causes "Cannot read property
'useState' of null" — a silent dual-React crash.

### babel-preset-expo needs `unstable_transformImportMeta`

Core's dist uses `import.meta`. Hermes does not support it. The babel config must enable
the polyfill.

### Package should export source, not dist

For the Expo playground, `@marwes-ui/react-native` exports `./src/index.ts` directly.
Metro transpiles it. This avoids needing a build step during development. For publishing,
a `tsup` or similar build would produce `./dist/`.

## CSS-to-RN Translation Reference

Documented edge cases from the POC:

| CSS | RN | Notes |
|---|---|---|
| `display: inline-flex` | `flexDirection: "row"` | CSS flex defaults to row; RN defaults to column |
| `var(--token)` | Runtime token lookup | Must map to `ResolvedTheme` property |
| `var(--token, fallback)` | Token with static fallback | `inherit`/`initial` fallbacks must be filtered |
| `color-mix(in srgb, X N%, transparent)` | Hex + alpha suffix | `#RRGGBB` + 2-char alpha |
| `box-shadow: inset 0 0 0 1px color` | `borderWidth` + `borderColor` | Only inset solid borders |
| `background-clip: content-box` | Not supported | Divider needs margin-based spacing instead |
| Component-local CSS vars | Two-pass: collect → inline-resolve | Variant selectors that only set vars need re-resolution |
| `inherit` / `initial` | Not valid in RN | Must return null from value parser |
| `line-height: 0` | Skip | Browser layout hack, not meaningful in RN |
| `cursor` / `user-select` / `transition` | Skip with reason | Browser-only, documented in manifest |
| Text props in View slot | Must not emit | 30+ props classified as VIEW_ONLY |

## Decision Point

Three paths forward:

### Path A: Keep compiler for Tier 1, hand-write Tier 2–3

- Compiler stays at current scope (~1 200 lines)
- ~10 families use compiled styles
- ~15 families use hand-written styles from `ResolvedTheme`
- Manifest + IR exist only for compiled families
- Lowest risk, most pragmatic

### Path B: Compiler for all families

- Compiler grows to handle pseudo-elements, grid, animations
- Becomes a substantial CSS-to-RN engine (3 000–5 000+ lines)
- All families compile from CSS
- Highest sync guarantee, highest complexity and maintenance cost

### Path C: No compiler, all hand-written

- Delete the compiler entirely
- Write `themeToStyles()` functions per family
- Each function is 50–150 lines using `ResolvedTheme` directly
- Simplest code, easiest to understand
- Styles may drift from web CSS over time — but are correct for native

**My recommendation: Path A.** It preserves the proof that compiled CSS works where it
works well, without forcing the compiler to handle patterns it was never designed for.
Tier 3 families get honest native implementations that use the same design tokens.

If the sync guarantee does not feel critical — if native components are allowed to look
right rather than compile from the exact same CSS — Path C is even simpler and still
uses Marwes theme tokens as the source of truth.
