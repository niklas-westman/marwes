<script lang="ts">
  import { PaginationField } from "@marwes-ui/svelte"

  interface Props {
    label?: string
    description?: string
    error?: string
    pageCount?: number
    siblingCount?: number
    initialPage?: number
    disabled?: boolean
  }

  let {
    label = "Search results",
    description = "Page through your filtered results.",
    error,
    pageCount = 10,
    siblingCount = 2,
    initialPage = 1,
    disabled,
  }: Props = $props()

  let page = $state(initialPage)
</script>

<div style="width: 480px;">
  <PaginationField
    {label}
    {description}
    {error}
    pagination={{
      pageCount,
      siblingCount,
      page,
      onpagechange: (next) => (page = next),
      disabled,
    }}
  />
</div>
