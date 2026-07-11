# Text Registry

> Family: `text`
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
| Semantic coverage | Family-local typography contract; no `data-component` metadata today |
| Generated structural truth | `registry.generated.json` + `artifacts/component-registry.json` |
| Primary Figma nodes | dashboard text frame `2832:29644`, typography/text-input row `2832:29277`, dashboard teaser text box `3088:24118` |
| Main AXE watch item | Text should not be used to fake document hierarchy that belongs to Heading or Paragraph |

## Registry ownership

- `README.md` is the human teaching page.
- `registry.meta.json` is the authored structured summary for this family.
- `registry.generated.json` and `artifacts/component-registry.json` are generator-owned structural outputs.
- `visuals/*.mmd` document typography ownership and native-element choices.

## Summary

Text is Marwes' small non-heading typography atom for labels, captions, overline, microcopy, and compact support text. It lets consumers choose `span`, `p`, or `div` while applying shared typography variants. Heading owns hierarchy; Paragraph owns long-form body copy.

## Family surface map

| Surface level | Main members | Why it matters |
| --- | --- | --- |
| Atom | `Text` | compact typography primitive |
| Core recipe | `createTextRecipe` | typography variant classes and native element selection |
| Theme source | `TextVariant` | shared variant vocabulary |
| Preset CSS | `typography.css` | shared typography variables and classes |
| React adapter | `@marwes-ui/react` -> `Text` | React runtime surface |
| Vue adapter | `@marwes-ui/vue` -> `Text` | Vue runtime surface |
| Svelte adapter | `@marwes-ui/svelte` -> `Text` | Svelte runtime surface |

## Canonical visual understanding

Read this section in this order:
1. Storybook Introduction and stories for runtime variants
2. `visuals/layer-map.mmd` for repo placement
3. `visuals/interaction-map.mmd` for native element and document-structure boundaries

## Primary visual sources

| Source | Path | Why it matters |
| --- | --- | --- |
| React Storybook | `apps/storybook-react/src/stories/text/Introduction.mdx` | React teaching surface |
| React Storybook | `apps/storybook-react/src/stories/text/text.stories.tsx` | runtime variants |
| Vue Storybook | `apps/storybook-vue/src/stories/text/Introduction.mdx` | Vue teaching surface |
| Vue Storybook | `apps/storybook-vue/src/stories/text/text.stories.ts` | Vue runtime parity |
| Svelte Storybook | `apps/storybook-svelte/src/stories/text/Introduction.mdx` | Svelte teaching surface |
| Svelte Storybook | `apps/storybook-svelte/src/stories/text/text.stories.ts` | Svelte runtime parity |
| Figma dashboard ref | `.figma/marwes/pages/------playground---dashboard/text_2832-29644.json` | typography-adjacent visual source |
| Figma row ref | `.figma/marwes/pages/------playground---dashboard/row-1-typography-text-inputs_2832-29277.json` | text/input composition context |

## Figma references

Primary synced refs:
- `.figma/INDEX.md`
- `.figma/marwes/pages/------playground---dashboard/text_2832-29644.json`
- `.figma/marwes/pages/------playground---dashboard/row-1-typography-text-inputs_2832-29277.json`
- `.figma/marwes/pages/-dashboard-teaser/text-box_3088-24118.json`
- `.figma/NODE_REFERENCE.md`
- `.figma/nodes.json`

Current sync note: there is no dedicated `.figma/marwes/components/text.json` file. Storybook and the shared typography preset are the better references for the full runtime Text API.

## Figma variant summary

| Surface | Variants | States | Notable tokens |
| --- | --- | --- | --- |
| Runtime Text atom | label, caption, overline, micro, body | `span`, `p`, `div` | shared typography variables |
| Synced dashboard refs | typography-adjacent text surfaces | light/dark page context | text primary and label/caption treatment |

## Visual model

- Layer map: [`visuals/layer-map.mmd`](./visuals/layer-map.mmd)
- File map: [`visuals/file-map.mmd`](./visuals/file-map.mmd)
- Interaction and semantics map: [`visuals/interaction-map.mmd`](./visuals/interaction-map.mmd)

## Philosophy

- Text is for compact support copy, not page hierarchy.
- The `as` prop makes semantic ownership explicit instead of hiding it behind visual variants.
- The family stays native-first and does not emit Marwes data-component metadata today.

## AXE / accessibility posture

| Area | Status | Notes |
| --- | --- | --- |
| Risk tier | Low | native text elements with small API surface |
| Audit status | Queued | no dedicated family audit doc yet |
| Automated contract | Present | `tests/contracts/text.contract.ts` plus adapter tests |
| Manual review boundary | Narrow | typography parity and semantic misuse in product compositions |
| AXE follow-up | Open | no release blocker identified |

## Semantics snapshot

| Field | Current family contract |
| --- | --- |
| `data-component` | none |
| canonical attributes | none |
| purpose vocabulary | none |
| source of truth | `packages/core/src/components/atoms/text/text-recipe.ts` and `packages/core/src/theme/text-variant.ts` |

## Linked files

| Layer | Path | Why it matters |
| --- | --- | --- |
| Core | `packages/core/src/components/atoms/text/` | recipe and types |
| Theme | `packages/core/src/theme/text-variant.ts` | variant vocabulary |
| Presets | `packages/presets/src/firstEdition/typography.css` | typography styling |
| React | `packages/react/src/components/text/` | React adapter |
| Vue | `packages/vue/src/components/text/` | Vue adapter |
| Svelte | `packages/svelte/src/lib/components/text/` | Svelte adapter |
| Stories React | `apps/storybook-react/src/stories/text/` | React docs and stories |
| Stories Vue | `apps/storybook-vue/src/stories/text/` | Vue docs and stories |
| Stories Svelte | `apps/storybook-svelte/src/stories/text/` | Svelte docs and stories |
| Contract | `tests/contracts/text.contract.ts` | shared behavioral proof |

## Verification

```bash
pnpm --filter @marwes-ui/react exec vitest run src/components/text
pnpm --filter @marwes-ui/vue exec vitest run src/components/text
pnpm registry:check
```

## Registry notes

Text intentionally references typography and dashboard-adjacent Figma refs because the current local sync has no dedicated Text component JSON.

## Open questions

- Should Text eventually emit family-local data attributes?
- Should Figma gain a dedicated Text component set separate from input-field text refs?
