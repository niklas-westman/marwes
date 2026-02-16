# Figma to Marwes Mapping Guide

This guide defines how design data from Figma should map into Marwes so implementation stays consistent.

## Scope
- Source design: Figma file tokens and component variants/states.
- Target implementation: `@marwes-ui/core`, `@marwes-ui/presets`, `@marwes-ui/react`.
- Current preset focus: `firstEdition`.

## Connection Setup (MCP)
Use this once per environment:
1. Configure a `figma` MCP server in Codex settings.
2. Point it to `https://mcp.figma.com/mcp`.
3. Complete auth (OAuth flow or bearer token/header config).
4. Confirm the server is enabled for your Codex session.

If you only log in but do not enable/select the server, Codex will not be able to read file data.

## Source of Truth
- Theme contract: `packages/core/src/theme/theme-types.ts`.
- Theme defaults: `packages/core/src/theme/theme-defaults.ts`.
- Preset defaults: `packages/presets/src/firstEdition/index.ts`.
- Preset styling: `packages/presets/src/firstEdition/*.css`.

Always map Figma values into these contracts before touching component adapters.

## Token Mapping

### Color Tokens

#### Primary & Secondary Colors
| Figma token | Marwes key | CSS var | Figma Color Name |
|---|---|---|---|
| `color.primary` | `theme.color.primary` | `--mw-primary` | Rich Black (#141414) |
| `color.onPrimary` | `theme.color.onPrimary` | `--mw-on-primary` | Text/Default-inverted (#F9FAFB) |
| `color.secondary` | `theme.color.secondary` | `--mw-secondary` | Soft White (#F9FAFB) |
| `color.onSecondary` | `theme.color.onSecondary` | `--mw-on-secondary` | Text/Default (#141414) |

#### Background & Surface
| Figma token | Marwes key | CSS var | Figma Color Name |
|---|---|---|---|
| `color.background` | `theme.color.background` | `--mw-background` | Default White (#FFFFFF) |
| `color.surface` | `theme.color.surface` | `--mw-surface` | Soft White (#F9FAFB) |
| `color.surfaceInverted` | `theme.color.surfaceInverted` | `--mw-surface-inverted` | Surface - Inverted (#141414) |

#### Text Colors
| Figma token | Marwes key | CSS var | Figma Color Name |
|---|---|---|---|
| `color.text` | `theme.color.text` | `--mw-text` | Text/Default (#141414) |
| `color.textMuted` | `theme.color.textMuted` | `--mw-text-muted` | Medium Grey (#9CA3AF) |
| `color.textInverted` | `theme.color.textInverted` | `--mw-text-inverted` | Text/Default-inverted (#F9FAFB) |

#### Borders
| Figma token | Marwes key | CSS var | Figma Color Name |
|---|---|---|---|
| `color.border` | `theme.color.border` | `--mw-border` | Light Grey (#E5E7EB) |
| `color.borderSubtle` | `theme.color.borderSubtle` | `--mw-border-subtle` | Border Low (#00000033, 20% opacity) |

#### Semantic Colors
| Figma token | Marwes key | CSS var | Figma Color Name |
|---|---|---|---|
| `color.danger` | `theme.color.danger` | `--mw-danger` | Error / Coral Red (#D90429) |
| `color.onDanger` | `theme.color.onDanger` | `--mw-on-danger` | White (#FFFFFF) |
| `color.success` | `theme.color.success` | `--mw-success` | Success / Field Green (#006633) |
| `color.onSuccess` | `theme.color.onSuccess` | `--mw-on-success` | White (#FFFFFF) |
| `color.warning` | `theme.color.warning` | `--mw-warning` | Warning / Amber Yellow (#FFB703) |
| `color.onWarning` | `theme.color.onWarning` | `--mw-on-warning` | Rich Black (#141414) |

**Contrast Color Pattern (`on-*`):**
- `on-*` colors represent text/icons displayed **on** their paired color background
- Ensures WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Example: `onPrimary` is the text color when `primary` is the background
- Used in buttons, badges, alerts, and any component with solid color backgrounds

**Dark Mode Preparation:**
- `surfaceInverted` and `textInverted` are ready for dark mode implementation
- Future: Flip `surface` ↔ `surfaceInverted` and `text` ↔ `textInverted` for dark mode
- `on-*` colors remain consistent across modes

### Typography Tokens
| Figma token | Marwes key | CSS var |
|---|---|---|
| `font.family.primary` | `theme.font.primary` | `--mw-font-primary` |
| `font.family.secondary` | `theme.font.secondary` | as needed per component |
| `font.family.mono` | `theme.font.mono` | as needed per component |
| `typography.h1.*` | `theme.typography.h1.*` | `--mw-heading-*` |
| `typography.h2.*` | `theme.typography.h2.*` | `--mw-heading-*` |
| `typography.h3.*` | `theme.typography.h3.*` | `--mw-heading-*` |
| `typography.paragraph.sm.*` | `theme.typography.paragraph.sm.*` | `--mw-p-*` |
| `typography.paragraph.md.*` | `theme.typography.paragraph.md.*` | `--mw-p-*` |
| `typography.paragraph.lg.*` | `theme.typography.paragraph.lg.*` | `--mw-p-*` |

### UI Tokens
| Figma token | Marwes key | CSS var |
|---|---|---|
| `radius.base` | `theme.ui.radius` | `--mw-radius` |
| `density` | `theme.ui.density` | layout/component modifier behavior |
| `variant.default` | `theme.ui.variant` | component modifier behavior |
| `icon.size` | `theme.icon.size` | icon recipe vars |
| `icon.strokeWidth` | `theme.icon.strokeWidth` | icon recipe vars |

## Component Mapping

### Button
- Contract: `packages/core/src/components/atoms/button/button-types.ts`.
- Recipe: `packages/core/src/components/atoms/button/button-recipe.ts`.
- CSS: `packages/presets/src/firstEdition/button.css`.

Required Figma variants/states to support:
- `tone`: `primary`, `secondary`, `text`.
- `size`: `xs`, `sm`, `md`, `lg`.
- states: `default`, `hover`, `focus-visible`, `disabled`, `loading`.
- icon patterns: `iconLeft`, `iconRight`, `iconOnly`.

### Input
- Contract: `packages/core/src/components/atoms/input/input-types.ts`.
- Recipe: `packages/core/src/components/atoms/input/input-recipe.ts`.
- CSS: `packages/presets/src/firstEdition/input.css`.

Required Figma variants/states to support:
- `tone`: `default`, `danger`, `success`.
- states: `default`, `focus-visible`, `invalid`, `disabled`.
- text roles: value text and placeholder text.

### Checkbox
- Contract: `packages/core/src/components/atoms/checkbox/checkbox-types.ts`.
- Recipe: `packages/core/src/components/atoms/checkbox/checkbox-recipe.ts`.
- CSS: `packages/presets/src/firstEdition/checkbox.css`.

Required Figma variants/states to support:
- `size`: `sm`, `md`, `lg`.
- states: `unchecked`, `checked`, `mixed`, `focus-visible`, `disabled`, `invalid`.

### Typography
- Contracts: `packages/core/src/components/atoms/heading/heading-types.ts`, `packages/core/src/components/atoms/paragraph/paragraph-types.ts`.
- CSS: `packages/presets/src/firstEdition/typography.css`.

Required Figma tokens:
- Heading scale: h1, h2, h3 (font size, line height, weight).
- Paragraph scale: sm, md, lg (font size, line height).

## Implementation Rules
- Do not hardcode Figma hex values in adapters (`@marwes-ui/react`).
- Put logic and mapping in core recipes and theme contracts.
- Put visual styling in preset CSS only.
- Keep CSS variable names on `--mw-*`.
- Keep classnames stable (`.mw-*`) for preset compatibility.

## Update Workflow
1. Confirm Figma tokens and component variants/states are final.
2. Update theme contract/defaults if new semantic token is needed.
3. Update `firstEdition` preset defaults for preset-specific baselines.
4. Update component recipe vars/class modifiers in `@marwes-ui/core`.
5. Update matching CSS in `packages/presets/src/firstEdition`.
6. Verify in Storybook and playground.
7. Document any new token/variant in this file and package docs.

## PR Checklist
- Mapping follows `theme-types.ts` semantics.
- No adapter-level hardcoded design values.
- Core emits typed vars/a11y only.
- Preset CSS matches recipe classnames and vars.
- New variants/states are represented in Storybook.
- Docs updated (`docs/FIGMA_TO_MARWES.md` and package README if needed).
