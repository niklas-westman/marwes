<script lang="ts">
  import { Pagination } from "@marwes-ui/svelte"
  import type { PaginationControlDisplay, PaginationGetItemAriaLabel } from "@marwes-ui/core"

  interface Props {
    page?: number
    pageCount?: number
    siblingCount?: number
    boundaryCount?: number
    maxVisibleItems?: number
    controlDisplay?: PaginationControlDisplay
    adaptive?: boolean
    showPrevNext?: boolean
    showFirstLast?: boolean
    disabled?: boolean
    ariaLabel?: string
    getItemAriaLabel?: PaginationGetItemAriaLabel
  }

  let {
    page: initialPage = 1,
    pageCount = 10,
    siblingCount = 2,
    boundaryCount,
    maxVisibleItems,
    controlDisplay,
    adaptive,
    showPrevNext,
    showFirstLast,
    disabled,
    ariaLabel,
    getItemAriaLabel,
  }: Props = $props()

  let page = $state(initialPage)
</script>

<Pagination
  bind:page
  {pageCount}
  {siblingCount}
  {boundaryCount}
  {maxVisibleItems}
  {controlDisplay}
  {adaptive}
  {showPrevNext}
  {showFirstLast}
  {disabled}
  {ariaLabel}
  {getItemAriaLabel}
/>
