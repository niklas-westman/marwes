<script lang="ts" generics="T extends string = string">
  import { SegmentedControlField } from "@marwes-ui/svelte"
  import type { SegmentedControlItem } from "@marwes-ui/svelte"

  interface Props {
    label?: string
    description?: string
    error?: string
    items?: SegmentedControlItem<T>[]
    initialValue?: T
    disabled?: boolean
    fullWidth?: boolean
  }

  let {
    label = "Row density",
    description = "Choose how much vertical space each row takes.",
    error,
    items = [
      { value: "compact" as T, label: "Compact" },
      { value: "comfortable" as T, label: "Comfortable" },
      { value: "spacious" as T, label: "Spacious" },
    ],
    initialValue = "comfortable" as T,
    disabled,
    fullWidth,
  }: Props = $props()

  let value = $state<T>(initialValue)
</script>

<div style="width: 420px;">
  <SegmentedControlField
    {label}
    {description}
    {error}
    segmentedControl={{
      items,
      value,
      onvaluechange: (v) => (value = v as T),
      disabled,
      fullWidth,
    }}
  />
</div>
