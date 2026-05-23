<script lang="ts">
  import MarwesProvider from "../lib/provider/MarwesProvider.svelte";
</script>

<MarwesProvider theme={{ breakpoint: { tablet: 1024 } }}>
  {#snippet children({ mwTheme })}
    <output>{mwTheme.spacing.sp16}:{mwTheme.media.tabletAndAbove}</output>
  {/snippet}
</MarwesProvider>
