<script lang="ts">
  import { MarwesProvider, useTheme, useThemeMode } from "@marwes-ui/svelte"
</script>

<!-- Default provider -->
<MarwesProvider>
  <p>Default theme</p>
</MarwesProvider>

<!-- With custom theme -->
<MarwesProvider theme={{ mode: "dark" }}>
  <p>Dark mode</p>
</MarwesProvider>

<!-- Children snippet receives CSS-provider mwTheme -->
<MarwesProvider theme={{ breakpoint: { tablet: 1024 } }}>
  {#snippet children({ mwTheme })}
    <p>{mwTheme.spacing.sp16} {mwTheme.media.tabletAndAbove}</p>
  {/snippet}
</MarwesProvider>
