<script lang="ts">
  import { MarwesProvider, ThemeMode, TooltipGroup } from "@marwes-ui/svelte"
</script>

<MarwesProvider theme={{ mode: ThemeMode.dark }}>
  <div style="padding: 24px; background: #2e2e2e; border-radius: 8px;">
    <TooltipGroup content="Tooltip text" triggerLabel="Show help" defaultOpen={true} />
  </div>
</MarwesProvider>
