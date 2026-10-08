<script lang="ts">
  let { note }: { note?: string } = $props()
</script>

{#if note}
  <p data-note>{note}</p>
{/if}
