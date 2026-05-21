<script lang="ts">
  import { SegmentedControl } from "@marwes-ui/svelte"
  import type { SegmentedControlItem } from "@marwes-ui/svelte"

  interface Props {
    items?: SegmentedControlItem[]
    value?: string
    variant?: "default" | "inverse" | "pill"
    size?: "sm" | "md"
    disabled?: boolean
    ariaLabel?: string
  }

  let {
    items = [
      { value: "compact", label: "Compact" },
      { value: "wide", label: "Wide" },
    ],
    value: initialValue = "compact",
    variant,
    size,
    disabled,
    ariaLabel = "Options",
  }: Props = $props()

  let currentValue = $state(initialValue)
</script>

<SegmentedControl
  {items}
  value={currentValue}
  {variant}
  {size}
  {disabled}
  {ariaLabel}
  onvaluechange={(v) => { currentValue = v }}
/>
