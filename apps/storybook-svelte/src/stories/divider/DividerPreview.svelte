<script lang="ts">
  import { Divider, Paragraph } from "@marwes-ui/svelte"
  import type { DividerProps } from "@marwes-ui/svelte"

  type Props = DividerProps

  let { orientation = "horizontal", ...rest }: Props = $props()
</script>

{#if orientation === "vertical"}
  <div
    style="display: flex; align-items: center; height: 140px; padding: 0 1rem; border-radius: 12px; background: rgba(14,165,233,0.16); box-shadow: inset 0 0 0 1px rgba(148,163,184,0.35);"
  >
    <Paragraph>Left content</Paragraph>
    <Divider {orientation} {...rest} />
    <Paragraph>Right content</Paragraph>
  </div>
{:else}
  <div
    style="width: 100%; border-radius: 12px; background: rgba(14,165,233,0.16); box-shadow: inset 0 0 0 1px rgba(148,163,184,0.35);"
  >
    <Divider {orientation} {...rest} />
  </div>
{/if}
