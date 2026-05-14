<script lang="ts">
  import { Card, Skeleton, StatTile, Toast } from "@marwes-ui/svelte"
  import type { SkeletonProps } from "@marwes-ui/svelte"

  interface Props {
    animation?: SkeletonProps["animation"]
    view?: "card" | "stat-tile" | "input-field" | "toast" | "list-card" | "gallery"
  }

  let { animation = "pulse", view = "gallery" }: Props = $props()
</script>

{#if view === "card" || view === "gallery"}
  <output aria-busy="true" aria-label="Loading card" style="display: block;">
    <Card style="width: 20rem;">
      {#snippet title()}
        <Skeleton {animation} width="56%" height={16} />
      {/snippet}
      <div style="display: grid; gap: 0.75rem;">
        <Skeleton {animation} variant="rectangular" width="100%" height={112} />
        <Skeleton {animation} width="92%" height={12} />
        <Skeleton {animation} width="74%" height={12} />
      </div>
    </Card>
  </output>
{/if}

{#if view === "gallery"}
  <div style="height: 1.5rem;" aria-hidden="true"></div>
{/if}

{#if view === "stat-tile" || view === "gallery"}
  <output aria-busy="true" aria-label="Loading stat tile" style="display: block;">
    <div
      style="width: 164px; display: flex; flex-direction: column; gap: 8px; padding: 20px; background: var(--mw-color-surface-elevated, #fff); border: 1px solid var(--mw-color-border-subtle, #e5e7eb); border-radius: 12px;"
      data-skeleton-replica="stat-tile"
    >
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
        <Skeleton {animation} width={84} height={12} />
        <Skeleton {animation} width={36} height={12} radius={999} />
      </div>
      <Skeleton {animation} width={104} height={28} />
      <Skeleton {animation} width={112} height={12} />
    </div>
  </output>
{/if}

{#if view === "gallery"}
  <div style="height: 1.5rem;" aria-hidden="true"></div>
{/if}

{#if view === "input-field" || view === "gallery"}
  <output aria-busy="true" aria-label="Loading input field" style="display: block;">
    <div
      class="mw-input-field"
      style="display: grid; gap: 0.5rem; width: 20rem;"
      data-skeleton-replica="input-field"
    >
      <Skeleton {animation} width={96} height={14} />
      <div
        style="display: flex; align-items: center; min-height: 2.75rem; padding-inline: 0.875rem; border: 1px solid var(--mw-color-border-subtle, #e5e7eb); border-radius: var(--mw-ui-radius, 4px); background: var(--mw-color-surface, #fff);"
      >
        <Skeleton {animation} width="58%" height={14} />
      </div>
      <Skeleton {animation} width={144} height={12} />
    </div>
  </output>
{/if}

{#if view === "gallery"}
  <div style="height: 1.5rem;" aria-hidden="true"></div>
{/if}

{#if view === "toast" || view === "gallery"}
  <output aria-busy="true" aria-label="Loading toast" style="display: block;">
    <Toast variant="subtle">
      {#snippet action()}
        <Skeleton {animation} width={52} height={20} />
      {/snippet}
      <Skeleton {animation} width={188} height={14} />
    </Toast>
  </output>
{/if}

{#if view === "gallery"}
  <div style="height: 1.5rem;" aria-hidden="true"></div>
{/if}

{#if view === "list-card" || view === "gallery"}
  <output aria-busy="true" aria-label="Loading list card" style="display: block;">
    <Card style="width: 26rem;">
      {#snippet title()}
        <Skeleton {animation} width={132} height={16} />
      {/snippet}
      <div style="display: grid; gap: 0.875rem;">
        {#each [0, 1, 2] as row (row)}
          <div
            style="display: grid; grid-template-columns: 2.5rem 1fr 4.5rem; gap: 0.75rem; align-items: center;"
          >
            <Skeleton {animation} variant="circular" width={40} height={40} />
            <div style="display: grid; gap: 0.75rem;">
              <Skeleton {animation} width="82%" height={12} />
              <Skeleton {animation} width="56%" height={12} />
            </div>
            <Skeleton {animation} width={60} height={24} radius={999} />
          </div>
        {/each}
      </div>
    </Card>
  </output>
{/if}
