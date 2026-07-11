# ProgressBar Registry

> Family: `progress-bar`
>
> Local design refs only — this page uses synced files under `.figma/` and makes no Figma API calls.

## Registry files

- [`registry.meta.json`](./registry.meta.json)
- [`registry.generated.json`](./registry.generated.json)
- [`../../../../artifacts/component-registry.json`](../../../../artifacts/component-registry.json)

## Registry snapshot

| Field | Value |
| --- | --- |
| Family status | Shipped |
| Audit status | First pass complete |
| Semantic coverage | Family-local `data-component=progress-bar` plus native `role=progressbar` value metadata |
| Generated structural truth | `registry.generated.json` + `artifacts/component-registry.json` |
| Primary Figma nodes | progress-bar component `1727:3852`, light frame `1727:3932`, dark frame `1727:4018` |
| Main AXE watch item | hidden-label usage still needs a truthful accessible name in product contexts |

## Registry ownership

- `README.md` is the human teaching page.
- `registry.meta.json` is the authored structured summary for this family.
- `registry.generated.json` and `artifacts/component-registry.json` are generator-owned structural outputs.
- `visuals/*.mmd` explain repo placement and progress semantics; Storybook remains the runtime visual source.

## Summary

ProgressBar is Marwes' read-only determinate progress indicator. It keeps value normalization, clamping, percentage display, disabled metadata, and `role="progressbar"` attributes in core so React, Vue, and Svelte render the same contract.

Use it for completion, upload, setup, or import progress. Do not use it for user-adjustable values; that remains Slider or SliderField territory.

## Family surface map

| Surface level | Main members | Why it matters |
| --- | --- | --- |
| Atom | `ProgressBar` | compact read-only progress display |
| Core recipe | `createProgressBarRecipe` | value normalization, fill width, label visibility, and metadata |
| Core a11y | `resolveProgressBarA11y` | progressbar value attributes and accessible naming |
| Preset CSS | `progress-bar.css` | track, fill, label, percentage, size, and disabled styling |
| React adapter | `@marwes-ui/react` -> `ProgressBar` | runtime React surface |
| Vue adapter | `@marwes-ui/vue` -> `ProgressBar` | runtime Vue surface |
| Svelte adapter | `@marwes-ui/svelte` -> `ProgressBar` | runtime Svelte surface |

## Canonical visual understanding

Read this section in this order:
1. Storybook Introduction and stories for runtime visuals
2. `visuals/layer-map.mmd` for repo placement
3. `visuals/interaction-map.mmd` for value normalization and accessibility flow

## Primary visual sources

| Source | Path | Why it matters |
| --- | --- | --- |
| React Storybook | `apps/storybook-react/src/stories/progress-bar/Introduction.mdx` | canonical React teaching surface |
| React Storybook | `apps/storybook-react/src/stories/progress-bar/progress-bar.stories.tsx` | runtime variants and states |
| Vue Storybook | `apps/storybook-vue/src/stories/progress-bar/Introduction.mdx` | canonical Vue teaching surface |
| Vue Storybook | `apps/storybook-vue/src/stories/progress-bar/progress-bar.stories.ts` | Vue runtime parity |
| Svelte Storybook | `apps/storybook-svelte/src/stories/progress-bar/Introduction.mdx` | canonical Svelte teaching surface |
| Svelte Storybook | `apps/storybook-svelte/src/stories/progress-bar/progress-bar.stories.ts` | Svelte runtime parity |
| Figma component | `.figma/marwes/components/progress-bar.json` | synced progress-bar component set |
| Figma showcase | `.figma/marwes/pages/-progress-bar/-progress-bar_1727-3932.json` | light frame |
| Figma showcase | `.figma/marwes/pages/-progress-bar/-progress-bar-dark_1727-4018.json` | dark frame |

## Figma references

Primary synced refs:
- `.figma/INDEX.md`
- `.figma/marwes/components/progress-bar.json`
- `.figma/marwes/pages/-progress-bar/-progress-bar_1727-3932.json`
- `.figma/marwes/pages/-progress-bar/-progress-bar-dark_1727-4018.json`
- `.figma/NODE_REFERENCE.md`
- `.figma/nodes.json`

## Figma variant summary

| Surface | Variants | States | Notable tokens |
| --- | --- | --- | --- |
| ProgressBar component | `small`, `default` | label, percentage, disabled, focus, hover, pressed | component-local progress track and fill variables |
| Storybook runtime | labeled, percentage-only, compact, disabled | clamped values and hidden-label examples | `--mw-progress-bar-*` preset variables |

## Visual model

- Layer map: [`visuals/layer-map.mmd`](./visuals/layer-map.mmd)
- File map: [`visuals/file-map.mmd`](./visuals/file-map.mmd)
- Interaction and semantics map: [`visuals/interaction-map.mmd`](./visuals/interaction-map.mmd)

## Philosophy

- ProgressBar is display-only; interactive numeric adjustment belongs to Slider.
- Core owns value normalization so adapters cannot drift on clamping or percentage math.
- Hidden visible labels are allowed only when the surrounding product context still provides an accessible name.

## AXE / accessibility posture

| Area | Status | Notes |
| --- | --- | --- |
| Risk tier | Low | native progressbar pattern with constrained state |
| Audit status | First pass complete | shared tests cover value metadata and visibility toggles |
| Automated contract | Present | `tests/contracts/progress-bar.contract.ts` plus adapter tests |
| Manual review boundary | Narrow | hidden-label product contexts and visual parity |
| AXE follow-up | Open | no current release blocker |

## Semantics snapshot

| Field | Current family contract |
| --- | --- |
| `data-component` | `progress-bar` |
| canonical attributes | family-local size, state, and disabled metadata |
| purpose vocabulary | none |
| source of truth | `packages/core/src/components/atoms/progress-bar/progress-bar-recipe.ts` and `progress-bar-a11y.ts` |

## Linked files

| Layer | Path | Why it matters |
| --- | --- | --- |
| Core | `packages/core/src/components/atoms/progress-bar/` | recipe, a11y, and types |
| Presets | `packages/presets/src/firstEdition/progress-bar.css` | token-driven styling |
| React | `packages/react/src/components/progress-bar/` | React adapter |
| Vue | `packages/vue/src/components/progress-bar/` | Vue adapter |
| Svelte | `packages/svelte/src/lib/components/progress-bar/` | Svelte adapter |
| Stories React | `apps/storybook-react/src/stories/progress-bar/` | React docs and stories |
| Stories Vue | `apps/storybook-vue/src/stories/progress-bar/` | Vue docs and stories |
| Stories Svelte | `apps/storybook-svelte/src/stories/progress-bar/` | Svelte docs and stories |
| Contract | `tests/contracts/progress-bar.contract.ts` | shared behavioral proof |
| Figma | `.figma/marwes/components/progress-bar.json` | component source |

## Verification

```bash
pnpm --filter @marwes-ui/react exec vitest run src/components/progress-bar
pnpm --filter @marwes-ui/vue exec vitest run src/components/progress-bar
pnpm --filter @marwes-ui/svelte exec vitest run src/lib/components/progress-bar
pnpm registry:check
```

## Registry notes

The registry entry intentionally uses Storybook and Mermaid orientation instead of committed preview screenshots.

## Open questions

- Should future design sources expose semantic progress intent colors beyond brand progress?
