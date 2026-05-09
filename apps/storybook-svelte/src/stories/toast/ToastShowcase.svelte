<script lang="ts">
  import { MarwesProvider, ThemeMode, Toast, Paragraph } from "@marwes-ui/svelte"

  interface Props {
    showcase: "all-variants" | "dark-variants"
  }

  const { showcase }: Props = $props()

  const variants = ["subtle", "outline", "rich"] as const
  const intents = ["neutral", "info", "success", "warning", "error"] as const

  function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
</script>

{#if showcase === "all-variants"}
  <div style="display: flex; flex-direction: column; gap: 24px;">
    {#each variants as variant}
      <div>
        <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #6b7280;">{capitalize(variant)}</p>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          {#each intents as intent}
            <Toast {variant} dataAttributes={{ "data-intent": intent }} ondismiss={() => {}}>
              {capitalize(intent)} — {capitalize(variant)} toast message.
            </Toast>
          {/each}
        </div>
      </div>
    {/each}
  </div>
{:else if showcase === "dark-variants"}
  <MarwesProvider theme={{ mode: ThemeMode.dark }}>
    <div style="display: flex; flex-direction: column; gap: 24px; padding: 20px; background: #0F0F0F; border-radius: 8px;">
      {#each variants as variant}
        <div>
          <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #9ca3af;">{capitalize(variant)}</p>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            {#each intents as intent}
              <Toast {variant} dataAttributes={{ "data-intent": intent }} ondismiss={() => {}}>
                {capitalize(intent)} — {capitalize(variant)} dark toast.
              </Toast>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </MarwesProvider>
{/if}
