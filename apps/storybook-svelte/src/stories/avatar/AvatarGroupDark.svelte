<script lang="ts">
  import { AvatarGroup, MarwesProvider, ThemeMode } from "@marwes-ui/svelte"

  const sampleItems = [
    { id: "mw", initials: "MW" },
    { id: "nk", initials: "NK" },
    { id: "as", initials: "AS" },
    { id: "guest", type: "icon" as const, ariaLabel: "Guest member" },
  ]
</script>

<MarwesProvider theme={{ mode: ThemeMode.dark }}>
  <div style="padding: 24px; background: #2e2e2e; border-radius: 12px;">
    <AvatarGroup ariaLabel="Project members" items={sampleItems} overflowCount={3} />
  </div>
</MarwesProvider>
