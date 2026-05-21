<script lang="ts">
  import { Pagination } from "@marwes-ui/svelte"

  interface Props {
    page?: number
    pageCount?: number
    siblingCount?: number
    boundaryCount?: number
    showPrevNext?: boolean
    disabled?: boolean
    ariaLabel?: string
  }

  let {
    page: initialPage = 1,
    pageCount = 10,
    siblingCount = 2,
    boundaryCount,
    showPrevNext,
    disabled,
    ariaLabel,
  }: Props = $props()

  let page = $state(initialPage)
</script>

<Pagination
  bind:page
  {pageCount}
  {siblingCount}
  {boundaryCount}
  {showPrevNext}
  {disabled}
  {ariaLabel}
/>
