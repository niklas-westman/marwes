# Pagination

Pagination is the canonical Marwes component for navigating finite page sets.
It keeps range generation, ellipsis placement, current-page semantics, and
adapter behavior aligned across React, Vue, and Svelte.

## Architecture

| Layer | Path | Responsibility |
|---|---|---|
| Core | `packages/core/src/components/atoms/pagination/` | Item-window generation, a11y props, render kits |
| Preset | `packages/presets/src/firstEdition/pagination.css` | Figma-matched dimensions, active state, focus/hover/disabled styling |
| React | `packages/react/src/components/pagination/` | React render/event adapter |
| Vue | `packages/vue/src/components/pagination/` | Vue render/event adapter |
| Svelte | `packages/svelte/src/lib/components/pagination/` | Svelte render/event adapter |
| Stories | `apps/storybook-*/src/stories/pagination/` | Documentation and visual states |

## Figma Contract

- Root component: `.figma/marwes/components/pagination.json`
- Page item: `.figma/marwes/components/partspaginationpage-item.json`
- Active page item: `.figma/marwes/components/partspaginationactive-page-item.json`
- Ellipsis: `.figma/marwes/components/partspaginationellipsis.json`

The firstEdition preset preserves the Figma 32px page item size, 8px radius,
2px page-item gap, 12px gap between previous/list/next groups, active blue
page fill, and neutral inactive labels.

## Accessibility

- The root renders a labelled `nav`.
- Page items are rendered in a list.
- The selected page receives `aria-current="page"`.
- Previous and next controls are disabled at page boundaries.
- Ellipses are hidden from assistive technology.

## Usage

```tsx
import { Pagination } from "@marwes-ui/react"

<Pagination
  page={page}
  pageCount={10}
  siblingCount={2}
  onPageChange={setPage}
/>
```

## Notes

- `showPrevNext={false}` hides the text controls while retaining page items.
- `siblingCount` and `boundaryCount` control the visible page window.
- The dashboard teaser consumes this public React component instead of owning a
  local styled copy.
