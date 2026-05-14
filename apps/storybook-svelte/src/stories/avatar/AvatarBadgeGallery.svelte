<script lang="ts">
  import { AvatarBadge, MarwesProvider, Paragraph, ThemeMode } from "@marwes-ui/svelte"

  interface AvatarBadgeGalleryProps {
    mode?: "light" | "dark"
  }

  let { mode = "light" }: AvatarBadgeGalleryProps = $props()

  const previews = [
    { label: "Small", size: "small" as const, initials: "MW" },
    { label: "Medium", size: "medium" as const, initials: "MW" },
    { label: "Large", size: "large" as const, initials: "MW" },
  ]
</script>

{#if mode === "dark"}
  <MarwesProvider theme={{ mode: ThemeMode.dark }}>
    <div style="display: flex; align-items: center; gap: 24px; padding: 24px; background: #2e2e2e; border-radius: 12px;">
      {#each previews as preview}
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <Paragraph size="sm" style="color: #d4d4d4;">{preview.label}</Paragraph>
          <AvatarBadge size={preview.size} initials={preview.initials} />
        </div>
      {/each}
    </div>
  </MarwesProvider>
{:else}
  <div style="display: flex; align-items: center; gap: 24px;">
    {#each previews as preview}
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <Paragraph size="sm">{preview.label}</Paragraph>
        <AvatarBadge size={preview.size} initials={preview.initials} />
      </div>
    {/each}
  </div>
{/if}
