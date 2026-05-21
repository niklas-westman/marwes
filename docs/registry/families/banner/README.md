# Banner Registry

> Family: `banner`

## Registry files

- [`registry.meta.json`](./registry.meta.json)
- [`../../../../artifacts/component-registry.json`](../../../../artifacts/component-registry.json)

## Summary

The Banner family is Marwes' inline page-level messaging component for persistent status information.
It provides:
- A single `Banner` atom with five semantic intents (neutral, info, success, warning, error)
- Optional leading icon, CTA action slot, and dismiss button (matching Figma's Show icon / Show CTA / Show Close toggles)
- Token-driven styling — variant controls surface, border, and icon color through `--mw-banner-*` custom properties
- Correct a11y roles: `role="alert"` + `aria-live="assertive"` for warning/error; `role="status"` + `aria-live="polite"` for others

## Family surface map

| Surface level | Members | Notes |
| --- | --- | --- |
| Atom | `Banner` | The single page-level status message surface |
| Slots | icon, message (default), action, dismiss | Matches Figma component properties |

## Figma references

- `.figma/marwes/components/banner.json` — component definition with boolean properties
- `.figma/marwes/pages/-banner/-banner_1593-5094.json` — light variants showcase
- `.figma/marwes/pages/-banner/-banner-dark_2444-2179.json` — dark variants showcase

## Linked files

| Layer | Path |
| --- | --- |
| Spec | `docs/reference/spec.md` → REQ-BANNER-001 |
| Core | `packages/core/src/components/atoms/banner/` |
| Presets | `packages/presets/src/firstEdition/banner.css` |
| React | `packages/react/src/components/banner/` |
| Vue | `packages/vue/src/components/banner/` |
| Svelte | `packages/svelte/src/lib/components/banner/` |
| Stories (React) | `apps/storybook-react/src/stories/banner/` |
| Stories (Vue) | `apps/storybook-vue/src/stories/banner/` |
| Stories (Svelte) | `apps/storybook-svelte/src/stories/banner/` |

## Verification

```bash
pnpm --filter @marwes-ui/react exec vitest run src/components/banner/__tests__/
pnpm --filter @marwes-ui/vue exec vitest run src/components/banner/__tests__/
pnpm typecheck
pnpm lint
```
