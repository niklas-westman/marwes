<script lang="ts">
  import { Spinner } from "@marwes-ui/svelte"

  interface Props {
    showcase?: "variants" | "sizes"
  }

  let { showcase = "variants" }: Props = $props()

  const variants = ["classic", "ring", "dual", "dots-round", "dots-square", "lines", "cross"] as const
  const sizes = [
    { token: "xs" as const, label: "16px" },
    { token: "sm" as const, label: "24px" },
    { token: "md" as const, label: "32px" },
    { token: "lg" as const, label: "40px" },
  ]
</script>

{#if showcase === "variants"}
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; width: 100%; max-width: 920px;">
    {#each variants as variant (variant)}
      <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem;">
        <div style="display: inline-flex; align-items: center; justify-content: center; min-width: 120px; min-height: 120px; padding: 1.5rem; border-radius: 16px; background: rgba(248, 250, 252, 0.88); box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.35);">
          <Spinner {variant} size="sm" decorative />
        </div>
        <span style="font-size: 13px; margin: 0;">{variant}</span>
      </div>
    {/each}
  </div>
{:else}
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; width: 100%; max-width: 920px;">
    {#each sizes as { token, label } (token)}
      <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem;">
        <div style="display: inline-flex; align-items: center; justify-content: center; min-width: 120px; min-height: 120px; padding: 1.5rem; border-radius: 16px; background: rgba(248, 250, 252, 0.88); box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.35);">
          <Spinner size={token} decorative />
        </div>
        <span style="font-size: 13px; margin: 0;">{token} — {label}</span>
      </div>
    {/each}
  </div>
{/if}
