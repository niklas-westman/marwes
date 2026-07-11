# Drawer Registry

> Family: `drawer`
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
| Semantic coverage | Canonical `data-component=drawer` with dialog panel semantics |
| Generated structural truth | `registry.generated.json` + `artifacts/component-registry.json` |
| Primary Figma nodes | drawer component set `3017:37258`, light frame `1609:15651`, dark frame `3017:37492`, container `2967:7341` |
| Main AXE watch item | modal focus trap, Escape handling, and focus return are product/composition-owned today |

## Registry ownership

- `README.md` is the human teaching page.
- `registry.meta.json` is the authored structured summary for this family.
- `registry.generated.json` and `artifacts/component-registry.json` are generator-owned structural outputs.
- `visuals/*.mmd` document the shell, panel, and lifecycle boundaries.

## Summary

Drawer is Marwes' side-panel primitive. Core owns panel classes, placement, size, optional scrim/footer/close affordances, and dialog accessibility attributes. Product code still owns open state, lifecycle orchestration, focus trap, Escape handling, and focus return.

## Family surface map

| Surface level | Main members | Why it matters |
| --- | --- | --- |
| Atom | `Drawer` | side-panel composition surface |
| Core recipe | drawer recipe + a11y helpers | panel, scrim, footer, close, modal metadata |
| Preset CSS | `drawer.css` | placement, size, scrim, panel, and footer styling |
| React adapter | `@marwes-ui/react` -> `Drawer` | React runtime surface |
| Vue adapter | `@marwes-ui/vue` -> `Drawer` | Vue runtime surface |
| Svelte adapter | `@marwes-ui/svelte` -> `Drawer` | Svelte runtime surface |

## Canonical visual understanding

Read this section in this order:
1. Storybook Introduction and stories for runtime visuals
2. `visuals/layer-map.mmd` for repo placement
3. `visuals/interaction-map.mmd` for the open-state and focus-management boundary

## Primary visual sources

| Source | Path | Why it matters |
| --- | --- | --- |
| React Storybook | `apps/storybook-react/src/stories/drawer/Introduction.mdx` | React teaching surface |
| React Storybook | `apps/storybook-react/src/stories/drawer/drawer.stories.tsx` | runtime examples |
| Vue Storybook | `apps/storybook-vue/src/stories/drawer/Introduction.mdx` | Vue teaching surface |
| Vue Storybook | `apps/storybook-vue/src/stories/drawer/drawer.stories.ts` | Vue runtime parity |
| Svelte Storybook | `apps/storybook-svelte/src/stories/drawer/Introduction.mdx` | Svelte teaching surface |
| Svelte Storybook | `apps/storybook-svelte/src/stories/drawer/drawer.stories.ts` | Svelte runtime parity |
| Figma component | `.figma/marwes/components/drawer.json` | synced component set |
| Figma page | `.figma/marwes/pages/-drawer/README.md` | local page index for light/dark frames |

## Figma references

Primary synced refs:
- `.figma/INDEX.md`
- `.figma/marwes/components/drawer.json`
- `.figma/marwes/pages/-drawer/-drawer_1609-15651.json`
- `.figma/marwes/pages/-drawer/-drawer-dark_3017-37492.json`
- `.figma/marwes/pages/-drawer/component-container_2967-7341.json`
- `.figma/NODE_REFERENCE.md`
- `.figma/nodes.json`

## Figma variant summary

| Surface | Variants | States | Notable tokens |
| --- | --- | --- | --- |
| Drawer component | default, minimal | light, dark, scrim, footer, dismissible | drawer surface, border, scrim |
| Runtime API | small, medium, large; left, right | modal, non-modal, footer, close button | size and placement are runtime props |

## Visual model

- Layer map: [`visuals/layer-map.mmd`](./visuals/layer-map.mmd)
- File map: [`visuals/file-map.mmd`](./visuals/file-map.mmd)
- Interaction and semantics map: [`visuals/interaction-map.mmd`](./visuals/interaction-map.mmd)

## Philosophy

- Drawer is dialog-adjacent, but it is not yet a fully managed modal lifecycle.
- Core owns stable panel semantics; applications own state and focus behavior.
- A future managed shell should be explicit rather than hidden inside the atom.

## AXE / accessibility posture

| Area | Status | Notes |
| --- | --- | --- |
| Risk tier | High | dialog-like pattern with lifecycle requirements |
| Audit status | Queued | no dedicated family audit doc yet |
| Automated contract | Partial | adapter and Storybook tests exist; no shared contract yet |
| Manual review boundary | High | focus trap, Escape, inert/background behavior, and focus return |
| AXE follow-up | Open | managed DrawerShell decision remains live |

## Semantics snapshot

| Field | Current family contract |
| --- | --- |
| `data-component` | `drawer` |
| canonical attributes | `data-component`, `data-size` |
| purpose vocabulary | none |
| source of truth | `packages/core/src/semantics/family-semantics.ts` |

## Linked files

| Layer | Path | Why it matters |
| --- | --- | --- |
| Core | `packages/core/src/components/atoms/drawer/` | recipe, a11y, and types |
| Semantic registry | `packages/core/src/semantics/family-semantics.ts` | canonical data-component contract |
| Presets | `packages/presets/src/firstEdition/drawer.css` | token-driven styling |
| React | `packages/react/src/components/drawer/` | React adapter |
| Vue | `packages/vue/src/components/drawer/` | Vue adapter |
| Svelte | `packages/svelte/src/lib/components/drawer/` | Svelte adapter |
| Stories React | `apps/storybook-react/src/stories/drawer/` | React docs and stories |
| Stories Vue | `apps/storybook-vue/src/stories/drawer/` | Vue docs and stories |
| Stories Svelte | `apps/storybook-svelte/src/stories/drawer/` | Svelte docs and stories |
| Figma | `.figma/marwes/components/drawer.json` | component source |

## Verification

```bash
pnpm --filter @marwes-ui/react exec vitest run src/components/drawer
pnpm --filter @marwes-ui/vue exec vitest run src/components/drawer
pnpm registry:check
```

## Registry notes

The registry intentionally documents lifecycle ownership as a boundary, not as completed modal infrastructure.

## Open questions

- Should Marwes add a managed DrawerShell for focus trap, Escape handling, and focus return?
- Should Drawer expose product-purpose variants such as filter drawer or details drawer?
