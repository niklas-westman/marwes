<script lang="ts">
  import PaginationPreview from "./PaginationPreview.svelte"
</script>

<div style="width: 240px;">
  <PaginationPreview page={6} pageCount={100} siblingCount={2} showFirstLast />
</div>
