# @marwes-ui/presets

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
import { MarwesProvider } from "@marwes-ui/react";
import { firstEdition } from "@marwes-ui/presets";
import "@marwes-ui/presets/firstEdition/styles.css";

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
- `molecules/input-field.css`

## Contract with Core
Core recipes emit:
- stable classes such as `mw-btn`, `mw-input`, `mw-checkbox`
- optional component-scoped vars when needed

Theme vars such as `--mw-color-primary-base` and `--mw-ui-radius` are emitted by the provider.

Presets must style those classes/vars consistently and should not require adapter-specific hacks.

## CSS Conventions
- Keep prefix `--mw-*` for variables.
- Keep classname prefix `.mw-*`.
- Prefer emitted semantic theme vars such as `--mw-color-primary-base`, `--mw-color-text`, and `--mw-color-surface` over hardcoded colors.
- Keep focus-visible and disabled states explicit in CSS.

## Figma Mapping
When syncing design changes from Figma, follow:
- `../../docs/guides/figma-to-marwes.md`

This ensures token names and state variants map predictably into preset CSS.

## Scripts
- `pnpm --filter @marwes-ui/presets dev`
- `pnpm --filter @marwes-ui/presets build`
- `pnpm --filter @marwes-ui/presets typecheck`

## Related Docs
- `../../docs/README.md`
- `../../docs/reference/architecture.md`
- `../../docs/guides/figma-to-marwes.md`
