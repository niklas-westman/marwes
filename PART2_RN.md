# Part 2 — React Native POC: Compiler Hardening + Badge & Divider

Status: implementation plan
Branch: `react-native-evaluation`
Prerequisite: Part 1 POC (Button compiles, bundles, and renders in Expo)

## What Part 1 Proved

The vertical slice works. The CSS compiler reads `button.css`, a native style manifest maps
selectors to RN slots, and the generated `resolveButtonStyles()` function produces valid
`ViewStyle`/`TextStyle` objects at runtime from `ResolvedTheme`. Metro bundles the whole chain
successfully for iOS and web.

| Metric | Result |
|---|---|
| Rules compiled | 72 |
| Compiler errors | 0 |
| Compiler warnings | 0 |
| Ignored declarations (with reasons) | 9 |
| iOS bundle time | ~580 ms |
| Web bundle time | ~100 ms |
| Modules bundled | 1154 |

## What Part 1 Exposed

Several gaps must be fixed before the compiler is useful beyond Button.

### 1. Component-local CSS custom properties

Badge uses locally scoped CSS variables:

```css
.mw-badge {
  --mw-badge-surface: transparent;
  --mw-badge-border: transparent;
  --mw-badge-label: inherit;
}
.mw-badge--info {
  --mw-badge-surface: var(--mw-color-status-info-background, #eeeeff);
}
```

The compiler currently only resolves `--mw-*` theme tokens. It needs to:

1. Detect component-local CSS variable declarations.
2. Track their values per selector/variant.
3. Inline-resolve them when another declaration references them.
4. Support fallback values in `var(--token, #hex)`.

### 2. `var()` with fallback values

Badge CSS uses `var(--mw-color-surface-subtle, #f5f5f5)`. The compiler currently matches
`var(--mw-token)` but drops the fallback. It must:

1. Parse `var(--token, fallback)` and keep both parts.
2. Use the theme token when available, fallback when not.

### 3. `box-shadow: inset` for borders

Badge uses `box-shadow: inset 0 0 0 1px var(--mw-badge-border)` as a border. RN has no
`box-shadow: inset`. The compiler must translate this to `borderWidth` + `borderColor` when
the pattern is `inset 0 0 0 Npx <color>`.

### 4. Logical properties

Divider uses `inline-size`, `block-size`, `padding-block`, `padding-inline`. The compiler
must map these to their physical RN equivalents:

| CSS logical | RN physical |
|---|---|
| `inline-size` | `width` |
| `block-size` | `height` |
| `padding-block` | `paddingVertical` |
| `padding-inline` | `paddingHorizontal` |

### 5. `calc()` expressions

Divider uses `calc((var(--spacing) - var(--thickness)) / 2)`. The compiler must either:

1. Evaluate simple `calc()` expressions when all operands are static or resolvable tokens.
2. Emit a runtime helper for dynamic calc expressions.
3. Block unsupported expressions with a diagnostic.

For Divider, the calc values come from recipe `vars` (static px values), so static
evaluation during compilation is viable.

### 6. Duplicate style resolution in Button

The current Button calls `resolveButtonStyles` twice per render — once in the Pressable
`style` callback and once in the children render function. This should be consolidated using
`React.useMemo` + state tracking.

### 7. `letter-spacing` and `white-space`

Badge uses `letter-spacing: 0` and `white-space: nowrap`. The compiler must:

- Map `letter-spacing` to RN `letterSpacing`.
- Ignore `white-space` (RN Text handles wrapping via `numberOfLines`).

### 8. `content-box` and `box-sizing`

Divider uses `box-sizing: content-box`. RN uses `border-box` everywhere. The compiler must
ignore this or translate spacing accordingly.

## Implementation Tasks

### Task 1: Fix Button double-resolve

**Files:** `packages/react-native/src/components/button/button.tsx`

Refactor Button to resolve styles once and share across Pressable style and children:

```tsx
// Use useState to track pressed, resolve styles once
const [pressed, setPressed] = React.useState(false)
const styles = React.useMemo(() => resolveButtonStyles(...), [deps])

<Pressable
  onPressIn={() => setPressed(true)}
  onPressOut={() => setPressed(false)}
  style={[styles.root, userStyle]}
>
  <Text style={[styles.label, userLabelStyle]}>{children}</Text>
</Pressable>
```

### Task 2: Compiler — component-local CSS variable resolution

**Files:** `scripts/generate-react-native-styles.ts`

1. Add a first pass over each rule that collects CSS variable declarations
   (`--mw-badge-*: value`).
2. Build a variable scope: `{ selector → { varName → resolvedValue } }`.
3. When a declaration references a local variable, inline-resolve it.
4. Track which local variables are set per variant selector so variant
   rules emit the correct resolved colors.

### Task 3: Compiler — `var()` fallback support

**Files:** `scripts/generate-react-native-styles.ts`

Update `parseValue()`:

```ts
// Match: var(--mw-token, #fallback)
const varFallbackMatch = raw.match(
  /^var\((--mw-[^,)]+?)\s*,\s*([^)]+)\)$/
)
```

Emit a `tokenWithFallback` IR node or resolve inline when the fallback is a
static value.

### Task 4: Compiler — `box-shadow: inset` → border translation

**Files:** `scripts/generate-react-native-styles.ts`

Detect `box-shadow: inset 0 0 0 <width> <color>` and emit:

```ts
{ prop: "borderWidth", value: width }
{ prop: "borderColor", value: resolvedColor }
```

Add `box-shadow` to `CSS_TO_RN_PROP` with a `_box_shadow_shorthand` handler.

### Task 5: Compiler — logical property mapping

**Files:** `scripts/generate-react-native-styles.ts`

Add to `CSS_TO_RN_PROP`:

```ts
"inline-size": "width",
"block-size": "height",
"padding-block": "_padding_block_shorthand",
"padding-inline": "_padding_inline_shorthand",
"padding-block-start": "paddingTop",
"padding-block-end": "paddingBottom",
"padding-inline-start": "paddingLeft",
"padding-inline-end": "paddingRight",
```

Add shorthand handlers for `padding-block` and `padding-inline`.

### Task 6: Compiler — simple `calc()` evaluation

**Files:** `scripts/generate-react-native-styles.ts`

In `parseValue()`, detect `calc(...)` and:

1. If all operands are static numbers (px/rem/unitless), evaluate at compile time.
2. If operands reference CSS variables that are static recipe vars, resolve then evaluate.
3. Otherwise emit a diagnostic.

For Divider, the recipe sets `--mw-divider-spacing: 32px` and `--mw-divider-line-thickness: 1px`
as inline CSS vars. The compiled `calc((32px - 1px) / 2)` = `15.5` can be a static number.

### Task 7: Compiler — `letter-spacing`, `white-space`, `vertical-align`, `border: none`

**Files:** `scripts/generate-react-native-styles.ts`

- Add `letter-spacing` → `letterSpacing` to prop map.
- Add `white-space` to ignored declarations with reason.
- Add `vertical-align` to ignored declarations with reason.
- Handle `border: none` / `border: 0` shorthand → `borderWidth: 0`.

### Task 8: Badge manifest + generated styles

**Files:**
- `packages/react-native/src/styles/manifests/first-edition/badge.native-style.json`
- `packages/react-native/src/styles/generated/first-edition.ts` (regenerated)
- `packages/react-native/src/styles/generated/first-edition.ir.json` (regenerated)

Create the manifest:

```json
{
  "version": 1,
  "preset": "firstEdition",
  "family": "badge",
  "sourceCss": "packages/presets/src/firstEdition/badge.css",
  "slots": {
    "root": { "type": "view", "selectors": [".mw-badge"] },
    "label": { "type": "text", "selectors": [".mw-badge"] }
  },
  "variants": {
    "neutral": [".mw-badge--neutral"],
    "info": [".mw-badge--info"],
    "success": [".mw-badge--success"],
    "warning": [".mw-badge--warning"],
    "error": [".mw-badge--error"]
  },
  "ignoredDeclarations": {
    "white-space": "RN Text handles wrapping via numberOfLines.",
    "box-shadow": "Translated to borderWidth+borderColor by compiler."
  }
}
```

### Task 9: Badge component

**Files:**
- `packages/react-native/src/components/badge/badge.tsx`
- `packages/react-native/src/components/badge/index.ts`

Simple View + Text component using core `createBadgeRecipe` and generated
`resolveBadgeStyles`.

### Task 10: Divider manifest + generated styles

**Files:**
- `packages/react-native/src/styles/manifests/first-edition/divider.native-style.json`
- Regenerated output

The manifest must handle orientation and size. Divider CSS uses recipe-injected
CSS vars for spacing and thickness.

The compiler should inline-resolve the recipe vars when they are static values.
For the native adapter, the Divider component can compute spacing directly from
the recipe since the values are deterministic.

### Task 11: Divider component

**Files:**
- `packages/react-native/src/components/divider/divider.tsx`
- `packages/react-native/src/components/divider/index.ts`

A styled View using core `createDividerRecipe`. Since Divider spacing is
deterministic from recipe vars, the component can resolve styles from the
recipe directly plus theme color for the line.

### Task 12: Update playground

**Files:** `apps/playground-react-native/App.tsx`

Add Badge and Divider sections to the demo screen, showing all variants
for Badge and size/orientation options for Divider.

### Task 13: Update package exports

**Files:** `packages/react-native/src/index.ts`

Export Badge, Divider, and their prop types.

## Implementation Order

```
1. Fix Button double-resolve
2. Compiler: var() fallback support
3. Compiler: component-local CSS variable resolution
4. Compiler: box-shadow inset → border
5. Compiler: logical properties
6. Compiler: letter-spacing, white-space, border: none
7. Badge manifest + regenerate
8. Badge component
9. Compiler: calc() evaluation (needed for Divider)
10. Divider manifest + regenerate
11. Divider component
12. Update playground with Badge + Divider
13. Update package exports
```

## Exit Criteria

- [x] `pnpm native-styles:check` passes with Button + Badge + Divider.
- [x] Expo bundle succeeds for iOS (952ms, 1133 modules).
- [x] Expo bundle succeeds for web (729ms, 239 modules).
- [x] Playground renders all three components in light and dark mode.
- [x] Badge shows all 5 variants with correct colors (23 rules generated).
- [x] Divider shows horizontal and vertical orientations.
- [x] No compiler errors or warnings for the three families.
- [x] Each ignored/skipped declaration has a documented reason.

## Implementation Results

| Family | Rules | Errors | Warnings | Ignored |
|---|---|---|---|---|
| Button | 72 | 0 | 0 | 9 |
| Badge | 23 | 0 | 0 | 2 |
| Divider | 3 | 0 | 0 | 3 |
| **Total** | **98** | **0** | **0** | **14** |

### Compiler features added

- Component-local CSS variable resolution (two-pass: collect → inline-resolve)
- CSS-variable-only selectors → re-resolve base declarations with variant scope
- `var(--token, #fallback)` → `tokenWithFallback` IR node
- `box-shadow: inset 0 0 0 Npx <color>` → `borderWidth` + `borderColor`
- Logical properties: `inline-size`, `block-size`, `padding-block`, `padding-inline`
- `calc()` evaluation with static px/rem operands
- `border: none` / `border: 0` shorthand
- `letter-spacing` → `letterSpacing`
- `display: block` / `inline-block` → no-op (RN flex default)
- `flex: none` → `flexGrow: 0` + `flexShrink: 0`
- Expanded token map: status colors, spacing scale, surface/border tokens
- `background-clip`, `box-sizing` → silent ignore via `_ignore`

### What worked well

1. **CSS-variable-only variant selectors** were the hardest problem. The two-pass
   approach (collect scopes → re-resolve base declarations) handles Badge cleanly
   without touching the manifest or adding manual style overrides.
2. **Divider** needed recipe-level spacing logic in the component. The compiled CSS
   provides base color; the component computes orientation and padding. This is an
   honest split: CSS owns visual tokens, component owns layout math.
3. **Token map expansion** was straightforward — adding status colors and spacing
   tokens to the generated resolver took minutes.

## Go / No-Go After Part 2

**Continue expanding** if:
- Badge and Divider compile cleanly with minor compiler additions.
- Component-local CSS variable resolution works reliably.
- Generated output is still readable and deterministic.
- Adding two components did not require invasive compiler changes.

**Pause and reassess** if:
- Compiler changes are large relative to the CSS being compiled.
- Component-local variable resolution creates edge cases that cascade.
- Generated output becomes hard to review.
