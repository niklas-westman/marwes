<script lang="ts">
  import type { IconName } from "@marwes-ui/core"
  import { storybookIconNames } from "@marwes-ui/core"
  import { Icon } from "@marwes-ui/svelte"

  interface Props {
    size?: "xs" | "sm" | "md" | "lg"
    strokeWidth?: "xs" | "sm" | "md" | "lg"
    search?: string
    columns?: number
  }

  let { size = "sm", strokeWidth = "md", search = "", columns = 8 }: Props = $props()

  const allNames = storybookIconNames as IconName[]

  const filteredNames = $derived.by(() => {
    const q = search.trim().toLowerCase()
    const filtered = q
      ? allNames.filter((name) => String(name).toLowerCase().includes(q))
      : [...allNames]
    return filtered.sort((a, b) => String(a).localeCompare(String(b)))
  })
</script>

<div style="padding: 16px; font-family: Instrument Sans, system-ui, -apple-system, sans-serif;">
  <div style="margin-bottom: 12px; font-size: 12px; opacity: 0.7;">
    Showing {filteredNames.length} of {allNames.length}
  </div>

  <div
    style="display: grid; grid-template-columns: repeat({columns}, minmax(0, 1fr)); gap: 12px;"
  >
    {#each filteredNames as name (name)}
      <div
        style="border: 1px solid rgba(0,0,0,0.1); border-radius: 10px; padding: 10px; text-align: center; display: flex; flex-direction: column; gap: 8px; align-items: center; justify-content: center; min-height: 84px;"
        title={String(name)}
      >
        <Icon {name} {size} {strokeWidth} />
        <div style="font-size: 11px; line-height: 1.2; opacity: 0.85; word-break: break-word;">
          {String(name)}
        </div>
      </div>
    {/each}
  </div>
</div>
