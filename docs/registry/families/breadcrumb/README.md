# Breadcrumb Registry

> Family: `breadcrumb`
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
| Audit status | Queued |
| Semantic coverage | Canonical `data-component=breadcrumb` with nav/list/current-page semantics |
| Generated structural truth | `registry.generated.json` + `artifacts/component-registry.json` |
| Primary Figma nodes | component set `1574:26965`, item `1574:26960`, separator `1574:26962`, light frame `1574:27193`, dark frame `1574:27268` |
| Main AXE watch item | current page must be truthful and announced through `aria-current=page` |

## Registry ownership

- `README.md` is the human teaching page.
- `registry.meta.json` is the authored structured summary for this family.
- `registry.generated.json` and `artifacts/component-registry.json` are generator-owned structural outputs.
- `visuals/*.mmd` orient maintainers; Storybook and synced Figma remain the visual sources.

## Summary

Breadcrumb is Marwes' location hierarchy component. Core builds a `nav`/`ol` render kit with optional home entry, hidden separators, and item-level current-page metadata. Routing, href resolution, and choosing the current item remain product-owned.

## Family surface map

| Surface level | Main members | Why it matters |
| --- | --- | --- |
| Atom | `Breadcrumb` | location context for nested pages |
| Core recipe | breadcrumb recipe + a11y helpers | nav/list structure, separators, current item metadata |
| Preset CSS | `breadcrumb.css` | item, separator, current, hover, and focus styling |
| React adapter | `@marwes-ui/react` -> `Breadcrumb` | React runtime surface |
| Vue adapter | `@marwes-ui/vue` -> `Breadcrumb` | Vue runtime surface |
| Svelte adapter | `@marwes-ui/svelte` -> `Breadcrumb` | Svelte runtime surface |

## Canonical visual understanding

Read this section in this order:
1. Storybook Introduction and stories for runtime visuals
2. `visuals/layer-map.mmd` for repo placement
3. `visuals/interaction-map.mmd` for routing and current-page boundaries

## Primary visual sources

| Source | Path | Why it matters |
| --- | --- | --- |
| React Storybook | `apps/storybook-react/src/stories/breadcrumb/Introduction.mdx` | React teaching surface |
| React Storybook | `apps/storybook-react/src/stories/breadcrumb/breadcrumb.stories.tsx` | runtime states |
| Vue Storybook | `apps/storybook-vue/src/stories/breadcrumb/Introduction.mdx` | Vue teaching surface |
| Vue Storybook | `apps/storybook-vue/src/stories/breadcrumb/breadcrumb.stories.ts` | Vue runtime parity |
| Svelte Storybook | `apps/storybook-svelte/src/stories/breadcrumb/Introduction.mdx` | Svelte teaching surface |
| Svelte Storybook | `apps/storybook-svelte/src/stories/breadcrumb/breadcrumb.stories.ts` | Svelte runtime parity |
| Figma component | `.figma/marwes/components/breadcrumb.json` | synced component source |
| Figma parts | `.figma/marwes/components/partsbreadcrumbbreadcrumb-item.json` and `partsbreadcrumbbreadcrumb-separator.json` | item/separator source |

## Figma references

Primary synced refs:
- `.figma/INDEX.md`
- `.figma/marwes/components/breadcrumb.json`
- `.figma/marwes/components/partsbreadcrumbbreadcrumb-item.json`
- `.figma/marwes/components/partsbreadcrumbbreadcrumb-separator.json`
- `.figma/marwes/pages/-breadcrumb/-breadcrumb_1574-27193.json`
- `.figma/marwes/pages/-breadcrumb/-breadcrumb-dark_1574-27268.json`
- `.figma/marwes/pages/-breadcrumb/component-container_1592-2744.json`

## Figma variant summary

| Surface | Variants | States | Notable tokens |
| --- | --- | --- | --- |
| Breadcrumb | home, link item, current page, separator | light, dark, hover, focus, current | breadcrumb link/current/muted treatment |
| Runtime API | optional home, item hrefs, current item | current-page aria metadata | routing remains consumer-owned |

## Visual model

- Layer map: [`visuals/layer-map.mmd`](./visuals/layer-map.mmd)
- File map: [`visuals/file-map.mmd`](./visuals/file-map.mmd)
- Interaction and semantics map: [`visuals/interaction-map.mmd`](./visuals/interaction-map.mmd)

## Philosophy

- Breadcrumb communicates location, not primary navigation.
- Core owns the nav/list/current-page semantics; product code owns actual routes.
- Separators are visual only and hidden from assistive tech.

## AXE / accessibility posture

| Area | Status | Notes |
| --- | --- | --- |
| Risk tier | Low | simple navigation hierarchy |
| Audit status | Queued | no dedicated family audit doc yet |
| Automated contract | Partial | adapter and Storybook tests exist; no shared contract yet |
| Manual review boundary | Narrow | current-page truth and visual parity |
| AXE follow-up | Open | no release blocker identified |

## Semantics snapshot

| Field | Current family contract |
| --- | --- |
| `data-component` | `breadcrumb` |
| canonical attributes | `data-component` |
| purpose vocabulary | none |
| source of truth | `packages/core/src/semantics/family-semantics.ts` |

## Linked files

| Layer | Path | Why it matters |
| --- | --- | --- |
| Core | `packages/core/src/components/atoms/breadcrumb/` | recipe, a11y, and types |
| Semantic registry | `packages/core/src/semantics/family-semantics.ts` | canonical data-component contract |
| Presets | `packages/presets/src/firstEdition/breadcrumb.css` | token-driven styling |
| React | `packages/react/src/components/breadcrumb/` | React adapter |
| Vue | `packages/vue/src/components/breadcrumb/` | Vue adapter |
| Svelte | `packages/svelte/src/lib/components/breadcrumb/` | Svelte adapter |
| Stories React | `apps/storybook-react/src/stories/breadcrumb/` | React docs and stories |
| Stories Vue | `apps/storybook-vue/src/stories/breadcrumb/` | Vue docs and stories |
| Stories Svelte | `apps/storybook-svelte/src/stories/breadcrumb/` | Svelte docs and stories |
| Figma | `.figma/marwes/components/breadcrumb.json` | component source |

## Verification

```bash
pnpm --filter @marwes-ui/react exec vitest run src/components/breadcrumb
pnpm --filter @marwes-ui/vue exec vitest run src/components/breadcrumb
pnpm registry:check
```

## Registry notes

Breadcrumb has package-level tests and Storybook coverage today. A shared cross-adapter contract can be added later if drift appears.

## Open questions

- Should a future helper infer current item from router state, or should routing remain fully product-owned?
