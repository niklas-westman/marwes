<script lang="ts">
  import { Pagination } from "@marwes-ui/svelte"
</script>

<div style="display: flex; flex-direction: column; gap: 24px;">
  <Pagination page={1} pageCount={10} siblingCount={2} />
  <Pagination page={5} pageCount={10} siblingCount={1} />
  <Pagination page={10} pageCount={10} siblingCount={2} />
  <Pagination page={3} pageCount={10} showPrevNext={false} />
  <Pagination page={3} pageCount={10} disabled />
</div>
