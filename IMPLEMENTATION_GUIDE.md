# Implementation Guide: Dashboard Teaser Page

Created: 2026-05-17
Status: draft
Branch: `dashboard-teaser`

---

## ⚠️ Living Document

This guide MUST be updated during implementation:

- ✅ Check off tasks as they are completed
- 📝 Add notes when reality diverges from plan
- 🔄 Reorder or split phases when blockers are discovered
- ➕ Add new tasks discovered during implementation
- ❌ Mark tasks as "skipped — <reason>" when they become irrelevant
- 🕐 Record timestamps on phase completions for velocity tracking
- 🧪 Update test coverage map as tests are written

**Last updated:** 2026-05-17
**Current phase:** 6 (complete)

---

## 0. Project Discovery

### Discovery Summary

| Variable | Value |
|---|---|
| Package manager | pnpm |
| Monorepo | Yes — `packages/`, `apps/` |
| Test runner | vitest |
| Test command | `pnpm test` |
| Typecheck | `pnpm typecheck` |
| Lint | `pnpm lint` (biome) |
| Build | `pnpm build` |
| Domain checks | `pnpm check:repo-map` |
| CI | None in repo root (node_modules only) |
| Feature paths | New app: `apps/dashboard-teaser/` |
| Existing tests | `packages/*/src/tests/*.test.ts` |
| Design source | `.figma/marwes/pages/-dashboard-teaser/teaser---latest_2737-11609.json` |

### Validation Stack

| Purpose | Command | Scope |
|---|---|---|
| Typecheck | `pnpm --filter dashboard-teaser typecheck` | New app |
| Lint/format | `pnpm lint` | Changed files |
| Build | `pnpm --filter dashboard-teaser build` | New app |
| Dev server | `pnpm --filter dashboard-teaser dev` | Manual visual check |

### Design Reference

**Figma node:** `2737-11609` ("Teaser - Latest")
**Figma URL:** `https://www.figma.com/design/VTv3dNTvt7R5EytQF47XbB?node-id=2737-11609&t=4Lnqk3PeYjsJtqPL-4`
**Dimensions:** 1440×3224 (desktop, light + dark variants)
**Font:** Instrument Sans (weight 500, 14px base)

---

## 1. Architecture Contract

### Problem Statement

Marwes needs a marketing/teaser landing page that showcases the design system's components in a visually compelling, pixel-accurate layout matching the Figma design. This page acts as the first impression for developers evaluating the library.

### Chosen Approach

Create a new Vite + React app (`apps/dashboard-teaser`) that:
- Uses `@marwes-ui/react` components directly (dogfooding the library)
- Follows the same workspace alias pattern as `apps/playground-react`
- Implements the exact layout from Figma node `2737-11609`
- Supports both light and dark theme variants
- Is a static build (no server, deployable to any CDN)

### Architecture Boundaries

| Layer | Owns | Does NOT Own |
|---|---|---|
| `apps/dashboard-teaser` | Page layout, sections, composition, static assets | Component internals, theme engine |
| `@marwes-ui/react` | Component rendering, theming | Page-level layout decisions |
| `@marwes-ui/core` | Design tokens, CSS variables | React rendering |

### Non-Negotiables

- [ ] Must use existing `@marwes-ui/react` components — no custom component forks
- [ ] Must match Figma design pixel-accurately (colors, spacing, typography)
- [ ] Must support light and dark variants with theme toggle
- [ ] Must be buildable and deployable as a static site
- [ ] Must use `Instrument Sans` font family as specified in design

---

## 2. Implementation Phases

### Phase 1: Project Scaffolding

**Goal:** Create the `apps/dashboard-teaser` Vite + React app with proper workspace configuration
**Depends on:** None
**Status:** ⬜ Not started

#### Inputs (must exist before starting)

- `apps/playground-react/` as reference for project structure and vite config

#### Outputs (must exist when done)

- `apps/dashboard-teaser/package.json`
- `apps/dashboard-teaser/tsconfig.json`
- `apps/dashboard-teaser/vite.config.ts`
- `apps/dashboard-teaser/index.html`
- `apps/dashboard-teaser/src/main.tsx`
- `apps/dashboard-teaser/src/App.tsx` (minimal shell)
- Dev server runs successfully

#### Relevant Paths

| What | Path | Action |
|---|---|---|
| Reference app | `apps/playground-react/` | Read |
| New app | `apps/dashboard-teaser/` | Create |
| Root package.json | `package.json` | Read (scripts reference) |

#### Tasks

- [ ] Create `apps/dashboard-teaser/package.json` with dependencies on `@marwes-ui/react`, `@marwes-ui/core`, `@marwes-ui/presets`, `react`, `react-dom`, `styled-components`, `vite`, `@vitejs/plugin-react`
  - **Tool:** `write`
  - **Verify:** `cat apps/dashboard-teaser/package.json | python3 -c "import json,sys; d=json.load(sys.stdin); assert '@marwes-ui/react' in str(d)"`

- [ ] Create `apps/dashboard-teaser/tsconfig.json` (match playground-react pattern)
  - **Tool:** `write`
  - **Verify:** `cat apps/dashboard-teaser/tsconfig.json`

- [ ] Create `apps/dashboard-teaser/vite.config.ts` with workspace aliases for `@marwes-ui/*`
  - **Tool:** `write`
  - **Verify:** `cat apps/dashboard-teaser/vite.config.ts`

- [ ] Create `apps/dashboard-teaser/index.html` with Instrument Sans font import
  - **Tool:** `write`
  - **Verify:** `cat apps/dashboard-teaser/index.html`

- [ ] Create minimal `apps/dashboard-teaser/src/main.tsx` and `apps/dashboard-teaser/src/App.tsx`
  - **Tool:** `write`
  - **Verify:** `ls apps/dashboard-teaser/src/main.tsx apps/dashboard-teaser/src/App.tsx`

- [ ] Run `pnpm install` to link workspace packages
  - **Tool:** `bash`
  - **Verify:** `pnpm install`

- [ ] Verify dev server starts
  - **Tool:** `bash`
  - **Verify:** `cd apps/dashboard-teaser && pnpm dev -- --host 2>&1 | timeout 5 head -10` (should show Vite URL)

#### Tests for This Phase

| Test Type | What to Test | Exists? | Path / Command |
|---|---|---|---|
| Type safety | TypeScript compiles | No → auto | `pnpm --filter dashboard-teaser typecheck` |
| Build | Vite builds successfully | No → auto | `pnpm --filter dashboard-teaser build` |

#### Phase Exit Criteria

- [ ] `pnpm --filter dashboard-teaser typecheck` passes
- [ ] `pnpm --filter dashboard-teaser build` passes
- [ ] Dev server starts without errors
- [ ] Guide updated with completion status

#### Failure Protocol

| If | Then |
|---|---|
| pnpm install fails | Check workspace protocol versions |
| Typecheck fails | Compare tsconfig with playground-react |
| Vite fails to start | Check alias config |

---

### Phase 2: Global Layout Shell

**Goal:** Implement the page-level layout: Header, main content area, Footer — matching Figma structure
**Depends on:** Phase 1
**Status:** ⬜ Not started

#### Inputs (must exist before starting)

- Working dev server from Phase 1
- Figma layout structure: Header (68px) → Content (flex) → Footer (48px)

#### Outputs (must exist when done)

- `apps/dashboard-teaser/src/components/Header.tsx` — Logo + theme toggle
- `apps/dashboard-teaser/src/components/Footer.tsx` — "Marwes — /mɑːr.wɛz/"
- `apps/dashboard-teaser/src/components/PageLayout.tsx` — Full-page vertical flex
- `apps/dashboard-teaser/src/App.tsx` — Updated with layout shell
- `apps/dashboard-teaser/src/styles/` — Styled-components for layout

#### Relevant Paths

| What | Path | Action |
|---|---|---|
| Figma source | `.figma/marwes/pages/-dashboard-teaser/teaser---latest_2737-11609.json` | Read |
| App entry | `apps/dashboard-teaser/src/App.tsx` | Edit |
| Components dir | `apps/dashboard-teaser/src/components/` | Create |

#### Tasks

- [ ] Create `PageLayout` — full viewport, vertical flex, 1440px max-width centered
  - **Tool:** `write`
  - **Verify:** Visual in browser

- [ ] Create `Header` — 1440px wide, 68px tall, horizontal flex, space-between, padding 16px 80px
  - Logo (Marwes wordmark — can be SVG or text initially)
  - Theme toggle (segmented control for light/dark)
  - Background: `#ffffff` (light) / dark equivalent
  - **Tool:** `write`
  - **Verify:** Visual in browser

- [ ] Create `Footer` — 1440px wide, 48px tall, left-aligned text "Marwes — /mɑːr.wɛz/"
  - Font: Instrument Sans, color `#141414`
  - **Tool:** `write`
  - **Verify:** Visual in browser

- [ ] Wire up theme toggle with `MarwesProvider` and `useThemeMode`
  - **Tool:** `edit`
  - **Verify:** Toggle switches between light/dark

#### Design Specs (from Figma)

```
Header:
  - width: 1440, height: 68
  - layout: HORIZONTAL, spacing: 16
  - padding: top=16, right=80, bottom=16, left=80
  - primaryAlign: SPACE_BETWEEN, counterAlign: CENTER
  - bg: #ffffff (light)
  - cornerRadius: 16

Footer:
  - width: 1440, height: 48
  - text: "Marwes — /mɑːr.wɛz/"
  - color: #141414
```

#### Tests for This Phase

| Test Type | What to Test | Exists? | Path / Command |
|---|---|---|---|
| Type safety | Components compile | Auto | `pnpm --filter dashboard-teaser typecheck` |
| Build | Full build succeeds | Auto | `pnpm --filter dashboard-teaser build` |

#### Phase Exit Criteria

- [ ] Header renders with logo and theme toggle
- [ ] Footer renders with brand text
- [ ] Page fills viewport vertically
- [ ] Theme toggle works (light ↔ dark)
- [ ] Typecheck passes
- [ ] Build passes
- [ ] Guide updated

#### Failure Protocol

| If | Then |
|---|---|
| Theme toggle doesn't work | Check MarwesProvider setup, compare with playground-react |
| Layout doesn't match | Re-read Figma bounds, check flex properties |

---

### Phase 3: Hero Section

**Goal:** Implement the hero area with headline, description, badges, links, and installation panel
**Depends on:** Phase 2
**Status:** ⬜ Not started

#### Inputs (must exist before starting)

- Working layout shell from Phase 2
- Figma hero structure (Frame 4: 1440×528)

#### Outputs (must exist when done)

- `apps/dashboard-teaser/src/sections/HeroSection.tsx`
- `apps/dashboard-teaser/src/sections/InstallationPanel.tsx`

#### Relevant Paths

| What | Path | Action |
|---|---|---|
| Figma source | `.figma/marwes/pages/-dashboard-teaser/teaser---latest_2737-11609.json` | Read |
| Sections dir | `apps/dashboard-teaser/src/sections/` | Create |

#### Tasks

- [ ] Create `HeroSection` — two-column layout within 1440px frame, 528px tall
  - **Tool:** `write`
  - **Verify:** Visual in browser

- [ ] Left column: Text box (483×204)
  - "Design with intention" — main headline
  - "Designed and developed with care. Built by craft. Open to all." — subtitle
  - Badges row: "Framework-agnostic", "Static CSS", "Type-safe", "A11y-first", "Agent-readable" (use `Badge` component)
  - Link badges: "Documentation", "Storybook", "GitHub"
  - **Tool:** `write`
  - **Verify:** Visual in browser

- [ ] Right column: Installation panel (400×400)
  - "Installation" heading
  - Segmented control: "React" | "Vue"
  - "Manually install" section with `InputField` showing `pnpm add @marwes-ui/react`
  - "Install with AI" section with `TextareaField` showing AI prompt
  - **Tool:** `write`
  - **Verify:** Visual in browser

#### Design Specs (from Figma)

```
Frame 7 (hero container):
  - width: 1440, height: 528
  - layout: HORIZONTAL

Left text box:
  - width: 483, height: 204
  - Headline: "Design with intention"
  - Subtitle: "Designed and developed with care. Built by craft. Open to all."
  - Badge row (483×20): Framework-agnostic, Static CSS, Type-safe, A11y-first, Agent-readable
  - Link row (284×24): Documentation, Storybook, GitHub

Right install panel:
  - width: 400, height: 400
  - "Installation" heading
  - Segmented: React | Vue
  - "Manually install" with InputField: "pnpm add @marwes-ui/react"
  - "Install with AI" with TextareaField: multi-line AI prompt
```

#### Tests for This Phase

| Test Type | What to Test | Exists? | Path / Command |
|---|---|---|---|
| Type safety | Components compile | Auto | `pnpm --filter dashboard-teaser typecheck` |
| Build | Full build succeeds | Auto | `pnpm --filter dashboard-teaser build` |

#### Phase Exit Criteria

- [ ] Hero headline and subtitle render correctly
- [ ] Badge components display with correct labels
- [ ] Installation panel shows both tabs (React/Vue)
- [ ] Input fields display placeholder values
- [ ] Layout matches Figma proportions
- [ ] Typecheck passes
- [ ] Build passes
- [ ] Guide updated

#### Failure Protocol

| If | Then |
|---|---|
| Badge component missing props | Check @marwes-ui/react exports |
| Input field styling wrong | Check preset CSS is loaded |
| Layout proportions off | Re-read Figma bounds exactly |

---

### Phase 4: Components Showcase Grid

**Goal:** Implement the component showcase section with all 9 rows of component demos
**Depends on:** Phase 3
**Status:** ⬜ Not started

#### Inputs (must exist before starting)

- Working hero section from Phase 3
- Figma content structure (Frame 5 → Content: 1296×2548)

#### Outputs (must exist when done)

- `apps/dashboard-teaser/src/sections/ComponentsShowcase.tsx`
- `apps/dashboard-teaser/src/sections/rows/` — individual row components

#### Relevant Paths

| What | Path | Action |
|---|---|---|
| Figma source | `.figma/marwes/pages/-dashboard-teaser/teaser---latest_2737-11609.json` | Read (deeper) |
| Rows dir | `apps/dashboard-teaser/src/sections/rows/` | Create |

#### Tasks

- [ ] Create `ComponentsShowcase` container — "Components" heading + rows wrapper
  - Background: `#f8f8f8`, width 1296, padding for content
  - **Tool:** `write`
  - **Verify:** Visual in browser

- [ ] Row 1: Switch + Card (1232×516)
  - Left (384×516): Switch component demo + SwitchField labels
  - Right (824×516): Card demo with title + body, Checkbox demos, CheckboxGroupField
  - **Tool:** `write`
  - **Verify:** Visual in browser

- [ ] Row 2: Accordion + Input fields (1232×310)
  - Accordion (864×310): 3 items with title/body, bg `#ffffff`
  - Input fields (344×310): Select + CurrencyField demo, bg `#ffffff`
  - **Tool:** `write`
  - **Verify:** Visual in browser

- [ ] Row 3: Toast + Context menu + Avatar (1232×472)
  - Toast (352×472): Segmented control (Label/Outline/Rich) + 4 toast variants, bg `#ffffff`
  - Item (276×472): Context menu with Edit/Preview/Download/Bookmark/Report/Delete, bg `#ffffff`
  - Row (556×472): OTP input + Badge + Radio demos
  - **Tool:** `write`
  - **Verify:** Visual in browser

- [ ] Row 4: Breadcrumb + Card + Dialog & Drawer (1232×202)
  - Item (918×202): Avatar group + Breadcrumb + Card, bg `#ffffff`
  - Item (290×202): Dialog/Drawer buttons, bg `#ffffff`
  - **Tool:** `write`
  - **Verify:** Visual in browser

- [ ] Row 5: Banner (1232×216)
  - Accordion (1232×216): 2 Banner variants with message + "Learn more" link, bg `#ffffff`
  - **Tool:** `write`
  - **Verify:** Visual in browser

- [ ] Row 6: Button + Pagination + Progress bar (1232×144)
  - 3 items (394×144 each): Button variants, Pagination, Progress bar, bg `#ffffff`
  - **Tool:** `write`
  - **Verify:** Visual in browser

- [ ] Row 7: Segmented buttons (1232×252)
  - Item (604×252): Segmented button – Inverse, bg `#ffffff`
  - Item (604×252): Segmented button – Default, bg `#ffffff`
  - **Tool:** `write`
  - **Verify:** Visual in browser

- [ ] Row 8: Spinner variants (1232×164)
  - Item (321×164): Spinners with labels (Loading…, Please wait), bg `#ffffff`
  - Item (887×164): Named spinner variants (Ring, Classic, Dual, Dots-Round, Dots-Square, Lines, Cross), bg `#ffffff`
  - **Tool:** `write`
  - **Verify:** Visual in browser

#### Design Specs (from Figma)

```
Content container:
  - width: 1296, bg: #f8f8f8
  - children: 9 rows

Row items:
  - bg: #ffffff (cards on gray background)
  - Consistent gap between rows

Components featured:
  - Switch, SwitchField
  - Card (title + body)
  - Checkbox, CheckboxGroupField
  - Accordion (3 items)
  - CurrencyField, Select
  - Toast (4 variants: neutral, meeting, verified, connection)
  - Context menu (6 items)
  - InputOtp (6 digits, "Verification code")
  - Badge (5 badges)
  - Radio, RadioGroupField
  - Avatar, AvatarGroup (+3 counter)
  - Breadcrumb (Label > Label > Current page)
  - Dialog, Drawer (buttons)
  - Banner (2 variants with "Learn more")
  - Button (3 variants)
  - Pagination (Previous, 1, 2, 3, …, 10, Next)
  - Progress bar (60%)
  - Segmented button (Compact/Wide/Rich)
  - Spinner (7 named variants)
```

#### Tests for This Phase

| Test Type | What to Test | Exists? | Path / Command |
|---|---|---|---|
| Type safety | All components compile | Auto | `pnpm --filter dashboard-teaser typecheck` |
| Build | Full build succeeds | Auto | `pnpm --filter dashboard-teaser build` |

#### Phase Exit Criteria

- [ ] All 9 rows render with correct components
- [ ] Component demos are interactive (switches toggle, accordions expand, etc.)
- [ ] Background colors match (`#f8f8f8` container, `#ffffff` cards)
- [ ] Layout proportions match Figma grid
- [ ] Typecheck passes
- [ ] Build passes
- [ ] Guide updated

#### Failure Protocol

| If | Then |
|---|---|
| Component not exported | Check `packages/react/src/index.ts` for available exports |
| Component API mismatch | Read component source in `packages/react/src/components/` |
| Missing component (e.g. Breadcrumb, Pagination, Banner, ContextMenu) | Implement as local styled component — document as follow-up to add to library |
| Grid alignment off | Use CSS Grid with explicit column widths from Figma |

---

### Phase 5: Dark Theme Variant

**Goal:** Ensure the dark theme variant renders correctly, matching the Figma "Teaser - Dark" frame
**Depends on:** Phase 4
**Status:** ⬜ Not started

#### Inputs (must exist before starting)

- Complete light theme implementation from Phase 4
- Figma "Teaser - Dark" frame (same structure, dark colors)

#### Outputs (must exist when done)

- Dark theme fully functional via toggle
- Colors invert correctly (backgrounds, text, card surfaces)
- All components respect theme mode

#### Tasks

- [ ] Verify MarwesProvider dark mode applies to all components
  - **Tool:** `bash` (visual check via dev server)
  - **Verify:** Toggle theme, confirm all components switch

- [ ] Adjust any hardcoded colors to use CSS variables / theme tokens
  - Review: `#ffffff` bg → theme surface, `#141414` text → theme text, `#f8f8f8` → theme surface-secondary
  - **Tool:** `edit`
  - **Verify:** Dark mode renders without white/light artifacts

- [ ] Match dark variant header/footer colors from Figma
  - **Tool:** `edit`
  - **Verify:** Visual comparison

#### Design Specs (from Figma)

```
Teaser - Dark:
  - Same structure as Light
  - Header/Footer: dark backgrounds
  - Content area: dark surface
  - Card surfaces: dark card color
  - Text: light on dark
```

#### Tests for This Phase

| Test Type | What to Test | Exists? | Path / Command |
|---|---|---|---|
| Type safety | No new type errors | Auto | `pnpm --filter dashboard-teaser typecheck` |
| Build | Still builds | Auto | `pnpm --filter dashboard-teaser build` |

#### Phase Exit Criteria

- [ ] Dark mode toggle works from header
- [ ] All components render correctly in dark mode
- [ ] No hardcoded light-only colors remain
- [ ] Typecheck passes
- [ ] Build passes
- [ ] Guide updated

#### Failure Protocol

| If | Then |
|---|---|
| Components don't theme | Ensure MarwesProvider wraps everything, check theme mode propagation |
| Hardcoded colors | Search for hex literals, replace with theme vars |

---

### Phase 6: Polish & Pixel-Perfect Pass

**Goal:** Final alignment pass to match Figma exactly — spacing, typography, sizing, border-radius
**Depends on:** Phase 5
**Status:** ⬜ Not started

#### Inputs (must exist before starting)

- Complete light + dark implementation
- Figma source for exact measurements

#### Outputs (must exist when done)

- All spacing matches Figma (padding, gaps, margins)
- Typography matches (font-size, weight, line-height)
- Border-radius matches
- Responsive behavior defined (or fixed at 1440px)

#### Tasks

- [ ] Audit header spacing: padding 16/80, border-radius 16
  - **Tool:** `edit`
  - **Verify:** Visual comparison with Figma

- [ ] Audit hero section proportions: left 483px, right 400px, total 528px height
  - **Tool:** `edit`
  - **Verify:** Visual comparison

- [ ] Audit component grid: 1296px container, row heights match Figma
  - **Tool:** `edit`
  - **Verify:** Visual comparison

- [ ] Audit typography: Instrument Sans, weight 500, size 14px baseline
  - **Tool:** `edit`
  - **Verify:** Visual comparison

- [ ] Audit card border-radius and shadow if any
  - **Tool:** `edit`
  - **Verify:** Visual comparison

- [ ] Add Marwes logo SVG (replace text placeholder)
  - **Tool:** `write`
  - **Verify:** Logo renders in header

#### Tests for This Phase

| Test Type | What to Test | Exists? | Path / Command |
|---|---|---|---|
| Type safety | Still compiles | Auto | `pnpm --filter dashboard-teaser typecheck` |
| Build | Still builds | Auto | `pnpm --filter dashboard-teaser build` |

#### Phase Exit Criteria

- [ ] Visual diff against Figma shows no major discrepancies
- [ ] All spacing values match design spec
- [ ] Typography is correct throughout
- [ ] Logo renders as SVG
- [ ] Typecheck passes
- [ ] Build passes
- [ ] Guide updated

#### Failure Protocol

| If | Then |
|---|---|
| Can't match exact pixel values | Use closest matching design token from Marwes |
| Font not loading | Check Google Fonts import in index.html |

---

## 3. Repeatable Unit Contract

### Unit Template: Component Row

Each row in the Components Showcase grid follows a similar pattern:

| Step | Description | Path | Action | Verify |
|---|---|---|---|---|
| 1 | Create row component file | `apps/dashboard-teaser/src/sections/rows/<RowName>.tsx` | Create | File exists |
| 2 | Import required Marwes components | Same file | Edit | No import errors |
| 3 | Implement layout matching Figma dimensions | Same file | Edit | Visual check |
| 4 | Wire up interactive state (if applicable) | Same file | Edit | Component is interactive |
| 5 | Export and add to ComponentsShowcase | `ComponentsShowcase.tsx` | Edit | Row renders in page |

**Unit done when:**
- [ ] Row renders at correct dimensions
- [ ] All components in row are visible and functional
- [ ] Light + dark theme works
- [ ] Typecheck passes

### Units (Rows)

| Unit | Status | Dimensions | Key Components | Notes |
|---|---|---|---|---|
| Row 1: Switch + Card | ⬜ | 1232×516 | Switch, SwitchField, Card, Checkbox, CheckboxGroupField | Largest row |
| Row 2: Accordion + Input | ⬜ | 1232×310 | Accordion, CurrencyField, Select | |
| Row 3: Toast + Menu + Avatar | ⬜ | 1232×472 | Toast, InputOtp, Badge, Radio | May need local ContextMenu |
| Row 4: Breadcrumb + Card + Dialog | ⬜ | 1232×202 | Avatar, Breadcrumb, Card, Dialog, Drawer | May need local Breadcrumb |
| Row 5: Banner | ⬜ | 1232×216 | Banner (2 variants) | May need local Banner |
| Row 6: Button + Pagination + Progress | ⬜ | 1232×144 | Button, Pagination, Progress bar | May need local Pagination/Progress |
| Row 7: Segmented buttons | ⬜ | 1232×252 | Segmented control variants | |
| Row 8: Spinner | ⬜ | 1232×164 | Spinner (7 named variants) | |

---

## 4. Test Strategy

### Principles

- This is primarily a **visual/layout** project — tests focus on build integrity and type safety
- No unit tests for individual visual compositions (tested via components in library)
- Build success + typecheck = primary validation
- Visual verification is manual against Figma reference

### Coverage Map

| Phase | What's Tested | Test Type | Path |
|---|---|---|---|
| Phase 1 | App scaffolding compiles | Typecheck + Build | `pnpm --filter dashboard-teaser typecheck && pnpm --filter dashboard-teaser build` |
| Phase 2 | Layout shell compiles | Typecheck + Build | Same |
| Phase 3 | Hero section compiles | Typecheck + Build | Same |
| Phase 4 | All components compile | Typecheck + Build | Same |
| Phase 5 | Dark theme compiles | Typecheck + Build | Same |
| Phase 6 | Final polish compiles | Typecheck + Build | Same |

### Full Validation Run

```bash
# Run after EVERY phase completion
pnpm --filter dashboard-teaser typecheck    # type safety
pnpm lint                                    # code quality (biome)
pnpm --filter dashboard-teaser build        # build integrity
```

---

## 5. Failure & Rollback Protocol

| Failure Type | Detection | Action |
|---|---|---|
| Type error | `typecheck` exits non-zero | Check component prop types against @marwes-ui/react exports |
| Build failure | `build` exits non-zero | Check imports, alias config |
| Missing component | Import error for component not in library | Implement as local styled component, document gap |
| Layout mismatch | Visual comparison fails | Re-read Figma JSON for exact values |
| Theme not working | Components don't change on toggle | Ensure MarwesProvider wraps correctly |
| Ambiguous requirement | Can't determine behavior from Figma | STOP — ask the user |
| Repeated failure (3x) | Same check fails 3 times | Escalate — try different approach |

---

## 6. Completion Tracker

| Phase | Title | Status | Typecheck | Build | Completed |
|---|---|---|---|---|---|
| 1 | Project Scaffolding | ✅ | pass | pass | 2026-05-17 |
| 2 | Global Layout Shell | ✅ | pass | pass | 2026-05-17 |
| 3 | Hero Section | ✅ | pass | pass | 2026-05-17 |
| 4 | Components Showcase Grid | ✅ | pass | pass | 2026-05-17 |
| 5 | Dark Theme Variant | ✅ | pass | pass | 2026-05-17 |
| 6 | Polish & Pixel-Perfect Pass | ✅ | pass | pass | 2026-05-17 |

---

## 7. Post-Completion Checklist

- [ ] All phases marked ✅
- [ ] `pnpm --filter dashboard-teaser typecheck` passes
- [ ] `pnpm --filter dashboard-teaser build` passes
- [ ] `pnpm lint` passes on changed files
- [ ] Light theme matches Figma "Teaser - Light" frame
- [ ] Dark theme matches Figma "Teaser - Dark" frame
- [ ] Theme toggle works correctly
- [ ] Guide reflects final state
- [ ] Branch `dashboard-teaser` ready for review/merge
- [ ] Any missing library components documented as follow-up issues

---

## Appendix: Components Availability Check

Components needed vs. what's exported from `@marwes-ui/react`:

| Component | Available in Library | Notes |
|---|---|---|
| Button | ✅ | Multiple variants (Primary, Secondary, Text, etc.) |
| Badge | ✅ | BadgeGroup also available |
| Switch / SwitchField | ✅ | |
| Card | ✅ | ProductCard, ProfileCard, StatCard variants |
| Checkbox / CheckboxGroupField | ✅ | |
| Radio / RadioGroupField | ✅ | |
| Accordion / AccordionField | ✅ | FAQ, Settings, Sections variants |
| Toast | ✅ | Success, Error, Warning, Info variants |
| Input / InputField / CurrencyField | ✅ | |
| InputOtp | ✅ | |
| Select / SelectField | ✅ | |
| Textarea / TextareaField | ✅ | |
| Avatar / AvatarGroup | ✅ | |
| Spinner | ✅ | Multiple variants |
| Dialog / DialogModal | ✅ | |
| Icon | ✅ | |
| Divider | ✅ | |
| Skeleton | ✅ | |
| Tooltip | ✅ | |
| Slider / SliderField | ✅ | |
| Tab / TabGroup | ✅ | |
| Breadcrumb | ❓ | Not found in exports — may need local implementation |
| Pagination | ❓ | Not found in exports — may need local implementation |
| Progress bar | ❓ | Not found in exports — may need local implementation |
| Banner | ❓ | Not found in exports — may need local implementation |
| Context menu | ❓ | Not found in exports — may need local implementation |
| Segmented control | ❓ | Not found in exports — may need local implementation |

> **Action:** Components marked ❓ will be implemented as local styled components within the teaser app. These gaps should be documented as future library additions.
