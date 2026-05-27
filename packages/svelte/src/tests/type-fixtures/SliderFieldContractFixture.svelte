<script lang="ts">
  import SliderField from "../../lib/components/slider/SliderField.svelte"
  import type { SliderFieldProps } from "../../lib/components/slider/types.js"
  import MarwesProvider from "../../lib/provider/MarwesProvider.svelte"

  let {
    id,
    label,
    description,
    helperText,
    error,
    slider,
    ariaDescribedBy,
    minValueLabel,
    maxValueLabel,
    labelPosition,
    showEdgeValues,
    dataAttributes,
    value = $bindable(50),
    class: className,
  }: SliderFieldProps = $props()
</script>

<MarwesProvider>
  <SliderField
    {id}
    {label}
    {description}
    {helperText}
    {error}
    {slider}
    {ariaDescribedBy}
    {minValueLabel}
    {maxValueLabel}
    {labelPosition}
    {showEdgeValues}
    {dataAttributes}
    class={className}
    bind:value
  />
</MarwesProvider>
