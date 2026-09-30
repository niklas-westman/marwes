<script lang="ts">
  import { PaginationField } from "@marwes-ui/svelte"

  let page = $state(1)
</script>

<PaginationField
  label="Search results"
  pagination={{
    page,
    pageCount: 10,
    controlDisplay: "label",
    maxVisibleItems: 5,
    onpagechange: (value) => (page = value),
  }}
/>
