<script lang="ts">
  import { MarwesProvider, ThemeMode, Tooltip } from "@marwes-ui/svelte"
</script>

<MarwesProvider theme={{ mode: ThemeMode.dark }}>
  <div style="padding: 24px; background: #2e2e2e; border-radius: 8px;">
    <Tooltip>Tooltip text</Tooltip>
  </div>
</MarwesProvider>
