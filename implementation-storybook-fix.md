# Storybook Svelte Audit — Discrepancies vs React Storybook

Date: 2026-05-07
Comparison: `apps/storybook-react/src/stories/` vs `apps/storybook-svelte/src/stories/`

---

## Summary

- 19 Svelte story families audited
- **Missing story files**: 21 purpose/variant stories that React has for components that exist in Svelte
- **Introduction.mdx gap**: All Svelte mdx files are 41–92 lines vs React's 47–625 lines. Content is drastically thinner — missing code examples, API references, architecture diagrams, accessibility guidance
- **Story quality gap**: Svelte stories are minimal args-only. React stories include multiple variants, controlled examples, argTypes with documentation, decorators, and render functions showing realistic usage
- **Missing argTypes/parameters**: Most Svelte stories omit `storybookA11yPolicy.smoke` and framework-specific `argTypes`

---

## 1. Missing Story Files

### Accordion
| React | Svelte | Status |
|-------|--------|--------|
| `faq-accordion.stories.tsx` | — | ❌ Missing |
| `sections-accordion.stories.tsx` | — | ❌ Missing |
| `settings-accordion.stories.tsx` | — | ❌ Missing |

### Avatar
| React | Svelte | Status |
|-------|--------|--------|
| `presence-avatar.stories.tsx` | — | ❌ Missing |
| `profile-avatar.stories.tsx` | — | ❌ Missing |
| `team-avatar-group.stories.tsx` | — | ❌ Missing |

### Input
| React | Svelte | Status |
|-------|--------|--------|
| `date-of-birth-field.stories.tsx` | — | ❌ Missing |
| `dropdown-field.stories.tsx` | — | ❌ Missing |
| `zip-code-field.stories.tsx` | — | ❌ Missing |

### Radio
| React | Svelte | Status |
|-------|--------|--------|
| `option-radio-group.stories.tsx` | — | ❌ Missing |
| `rating-radio-group.stories.tsx` | — | ❌ Missing |
| `yes-no-radio-group.stories.tsx` | — | ❌ Missing |

### Slider
| React | Svelte | Status |
|-------|--------|--------|
| `brightness-slider.stories.tsx` | — | ❌ Missing |
| `radius-slider.stories.tsx` | — | ❌ Missing |
| `volume-slider.stories.tsx` | — | ❌ Missing |

### Switch
| React | Svelte | Status |
|-------|--------|--------|
| `feature-toggle.stories.tsx` | — | ❌ Missing |
| `permission-switch.stories.tsx` | — | ❌ Missing |
| `preference-switch.stories.tsx` | — | ❌ Missing |

### Tab
| React | Svelte | Status |
|-------|--------|--------|
| `content-tabs.stories.tsx` | — | ❌ Missing |
| `navigation-tabs.stories.tsx` | — | ❌ Missing |
| `settings-tabs.stories.tsx` | — | ❌ Missing |

---

## 2. Story Quality Gaps (existing files)

### Select (`input/select.stories.ts`)
- **React**: Has `native` argType control, Figma node reference in docs description, `Invalid` story variant, `Controlled` story with state, decorators for sizing
- **Svelte**: Only 3 minimal stories (Default, WithValue, Disabled). No `native` control, no `Invalid` state, no docs description
- **Fix**: Add `native` argType, add `Invalid` story, add Figma reference in docs description

### SelectField (`input/select-field.stories.ts`)
- **React**: Has `native` argType, `Required` story, `Controlled` story, `Native` story showing browser chrome, custom width styling, docs description with Figma reference
- **Svelte**: Only 4 stories (Default, WithHelperText, WithError, Disabled). Missing Native story, no `native` toggle
- **Fix**: Add `Native` story variant, add `native` argType

### InputField (`input/input-field.stories.ts`)
- **React**: Has `ReadOnly`, `Required`, `Controlled` story variants with realistic state management
- **Svelte**: Only 5 stories. Missing `ReadOnly`, `Required` variants
- **Fix**: Add `ReadOnly` and `Required` story variants

### SearchField (`input/search-field.stories.ts`)
- **React**: Has `SearchExample` with state, `WithHelperText`, `WithError`, `Disabled`, `ReadOnly` — all showing the search icon and clear button in action
- **Svelte**: Only `Default` story with minimal args
- **Fix**: Add `WithHelperText`, `WithError`, `Disabled` story variants at minimum

### Heading (`heading/heading.stories.ts`)
- **React**: Shows all 3 levels (H1, H2, H3) in separate stories plus `AllLevels`, `SizeOverride`, `WithCustomClass`, `WithID`, `LongText`, `ContentHierarchy` examples
- **Svelte**: Only 2 stories (Default, WithSizeOverride) for H1 only
- **Fix**: Add H2, H3 stories plus `AllLevels` combined story

### Spinner (`spinner/spinner.stories.ts`)
- **React**: Uses `storybookSpinnerArgTypes`, has `AllVariants` grid, `AllSizes` grid, `ButtonLoadingTreatment`, `EmptyStateTreatment`, `AccessibleStatus` — shows comprehensive visual showcase
- **Svelte**: Individual stories per variant (Classic, Ring, etc.) — correct but different presentation. Missing `AllVariants` showcase grid and `storybookSpinnerArgTypes`
- **Fix**: Add `storybookSpinnerArgTypes` to meta, consider adding an AllVariants gallery story

### Avatar (`avatar/avatar.stories.ts`)
- **React**: Shows all sizes × all types (initials, icon, image) in matrix, dark mode preview, uses `AvatarSize`/`AvatarType` enums
- **Svelte**: Only 5 stories with string size values
- **Fix**: Add matrix preview showing size × type combinations

### Slider (`slider/slider.stories.ts`)
- **React**: Uses `storybookSliderArgTypes`, has stage wrapper styling, `ShowTooltip`, `Disabled`, controlled preview with state, multiple demo stories
- **Svelte**: 3 minimal stories (Default, WithStep, Disabled). Missing `storybookSliderArgTypes`, tooltip story, stage styling
- **Fix**: Add `storybookSliderArgTypes`, add ShowTooltip story

### RadioGroupField (`radio/radio-group-field.stories.ts`)
- **React**: Has `Required` story
- **Svelte**: Missing `Required` story
- **Fix**: Add Required story variant

---

## 3. Introduction.mdx Content Gaps

All Svelte Introduction.mdx files are significantly thinner than React counterparts:

| Family | React lines | Svelte lines | Gap |
|--------|-------------|--------------|-----|
| input | 625 | 92 | Missing: architecture diagram updates for all purpose fields, SearchField/PasswordField affordance docs, RichText docs, InputOtp docs, field comparison table |
| button | 394 | 58 | Missing: variant vs action explanation, loading states docs, purpose component reference table, type-safe enums reference |
| radio | 178 | 53 | Missing: purpose component docs (YesNo, Rating, Option), controlled examples |
| accordion | 171 | 55 | Missing: purpose component docs (FAQ, Settings, Sections), molecule docs |
| switch | 155 | 50 | Missing: purpose component docs (FeatureToggle, Permission, Preference) |
| tab | 137 | 54 | Missing: purpose component docs (Content, Navigation, Settings) |
| slider | 137 | 51 | Missing: purpose component docs (Volume, Brightness, Radius) |
| badge | 146 | 47 | Missing: purpose component docs, molecule docs |
| card | 130 | 49 | Missing: purpose component docs |
| avatar | 127 | 52 | Missing: molecules + purpose component docs |
| spacing | 110 | 41 | Missing: spacing token reference |

**Recommendation**: The Introduction.mdx files should document all available components in the family, including molecules and purpose wrappers, with Svelte-specific code examples.

---

## 4. Missing Parameters/ArgTypes

### `storybookA11yPolicy.smoke` missing from:
- `input/select.stories.ts`
- `input/input-field.stories.ts`
- `spinner/spinner.stories.ts` (has centered layout, but no a11y)
- `heading/heading.stories.ts`
- `avatar/avatar.stories.ts`
- `checkbox/checkbox.stories.ts`
- `divider/divider.stories.ts` (uses DividerPreview so may be intentional)
- `radio/radio.stories.ts`
- `skeleton/skeleton.stories.ts`
- `slider/slider.stories.ts`
- `spacing/spacing.stories.ts`
- `stat-tile/stat-tile.stories.ts`
- `switch/switch.stories.ts`
- `tab/tab-group.stories.ts`

React includes `storybookA11yPolicy.smoke` on all stories. Svelte omits it from most atom stories.

### Missing `argTypes`:
- Select: missing `native` control
- Spinner: missing `storybookSpinnerArgTypes`  
- Slider: missing `storybookSliderArgTypes`
- Divider: already uses `storybookDividerArgTypes` ✓

---

## 5. Structural Differences

### Radio story passes non-existent props
- `radio/radio-group-field.stories.ts` passes `name`, `options`, `defaultValue` to `RadioGroupField`
- But `RadioGroupField` only accepts `label`, `description`, `error`, `children` snippet
- The story won't actually render radio options — it's broken
- **Fix**: Create a wrapper component (like BadgeGroupStory.svelte) that renders OptionRadioGroup or similar

### Tab story title
- React: `Tab/Molecule` for TabGroup
- Svelte: `Tab/Molecule` ✓ (correct)
- React also has `Tab/Atom` for the raw Tab component — Svelte doesn't export a raw Tab atom

---

## Priority Fix Order

1. ~~**Add 21 missing purpose story files**~~ ✅ FIXED
2. ~~**Fix broken RadioGroupField story**~~ ✅ FIXED
3. ~~**Add `storybookA11yPolicy.smoke`** to all story metas~~ ✅ FIXED
4. ~~**Add missing argTypes** (Select native, Spinner, Slider)~~ ✅ FIXED
5. ~~**Enrich existing stories** with more variants (ReadOnly, Required, etc.)~~ ✅ FIXED
6. ~~**Expand Introduction.mdx** to document molecules and purpose wrappers~~ ✅ FIXED
7. ~~**Add gallery/matrix stories** for Avatar, Spinner (matching React's showcase style)~~ ✅ FIXED
