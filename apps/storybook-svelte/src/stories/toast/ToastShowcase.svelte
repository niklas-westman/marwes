<script lang="ts">
  import { MarwesProvider, ThemeMode, Toast } from "@marwes-ui/svelte"

  interface Props {
    showcase: "all-variants" | "dark-variants"
  }

  const { showcase }: Props = $props()

  const variants = ["subtle", "outline", "rich"] as const

  function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
</script>

{#if showcase === "all-variants"}
  <div style="display: flex; flex-direction: column; gap: 12px;">
    {#each variants as v}
      <Toast variant={v} ondismiss={() => {}}>
        {capitalize(v)} — Your changes have been saved.
      </Toast>
    {/each}
  </div>
{:else if showcase === "dark-variants"}
  <MarwesProvider theme={{ mode: ThemeMode.dark }}>
    <div style="display: flex; flex-direction: column; gap: 12px; padding: 20px; background: #000000; border-radius: 8px;">
      {#each variants as v}
        <Toast variant={v} ondismiss={() => {}}>
          {capitalize(v)} — Dark mode toast.
        </Toast>
      {/each}
    </div>
  </MarwesProvider>
{/if}
