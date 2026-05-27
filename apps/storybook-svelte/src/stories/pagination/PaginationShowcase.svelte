<script lang="ts">
  import { Pagination } from "@marwes-ui/svelte"
</script>

<div style="display: flex; flex-direction: column; gap: 24px;">
  <Pagination page={1} pageCount={10} siblingCount={2} ariaLabel="Pagination default state" />
  <Pagination page={5} pageCount={10} siblingCount={1} ariaLabel="Pagination compact state" />
  <Pagination page={10} pageCount={10} siblingCount={2} ariaLabel="Pagination last page state" />
  <Pagination page={5} pageCount={10} showFirstLast ariaLabel="Pagination first last state" />
  <Pagination page={5} pageCount={10} controlDisplay="icon" ariaLabel="Pagination icon controls state" />
  <Pagination page={3} pageCount={10} showPrevNext={false} ariaLabel="Pagination without previous next state" />
  <Pagination page={3} pageCount={10} disabled ariaLabel="Pagination disabled state" />
</div>
