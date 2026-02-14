# @marwes/presets

Design presets for Marwes. Presets define theme defaults and static CSS for component classnames.

## Responsibilities
- Provide preset objects (currently `firstEdition`).
- Provide static CSS for `.mw-*` classnames.
- Map semantic theme values to visual styles with CSS variables.

## Non-Responsibilities
- No component logic.
- No framework rendering.
- No runtime CSS-in-JS.

## Install and Use
```tsx
import { MarwesProvider } from "@marwes/react";
import { firstEdition } from "@marwes/presets";
import "@marwes/presets/firstEdition/styles.css";

<MarwesProvider preset={firstEdition}>
  <App />
</MarwesProvider>;
```

## firstEdition
Preset definition:
- `src/firstEdition/index.ts`

Main stylesheet:
- `src/firstEdition/styles.css`

Imported component styles:
- `button.css`
- `input.css`
- `checkbox.css`
- `icon.css`
- `typography.css`
- `molecules/checkbox-field.css`

## Contract with Core
Core recipes emit:
- stable classes such as `mw-btn`, `mw-input`, `mw-checkbox`
- CSS vars such as `--mw-primary`, `--mw-radius`

Presets must style those classes/vars consistently and should not require adapter-specific hacks.

## CSS Conventions
- Keep prefix `--mw-*` for variables.
- Keep classname prefix `.mw-*`.
- Prefer semantic vars from core (`--mw-primary`, `--mw-text`, `--mw-surface`) over hardcoded colors.
- Keep focus-visible and disabled states explicit in CSS.

## Figma Mapping
When syncing design changes from Figma, follow:
- `../../docs/FIGMA_TO_MARWES.md`

This ensures token names and state variants map predictably into preset CSS.

## Scripts
- `pnpm --filter @marwes/presets dev`
- `pnpm --filter @marwes/presets build`
- `pnpm --filter @marwes/presets typecheck`

## Related Docs
- `../../docs/PROJECT.md`
- `../../docs/ARCHITECTURE.md`
- `../../docs/ENGINEERING.md`
