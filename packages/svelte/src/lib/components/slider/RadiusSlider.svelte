<script lang="ts">
  import SliderField from "./SliderField.svelte";
  import type { SliderFieldProps, SliderProps } from "./types.js";

  interface RadiusSliderProps extends Omit<SliderFieldProps, "label" | "slider" | "minValueLabel" | "maxValueLabel"> {
    label?: string;
    slider?: Omit<SliderProps, "value">;
    orientation?: SliderProps["orientation"];
    minValueLabel?: string;
    maxValueLabel?: string;
  }

  let {
    label = "Radius",
    slider,
    orientation,
    minValueLabel = "0px",
    maxValueLabel = "48px",
    dataAttributes,
    ...rest
  }: RadiusSliderProps = $props();
</script>

<SliderField
  {...rest}
  {label}
  {minValueLabel}
  {maxValueLabel}
  slider={{ min: 0, max: 48, step: 2, showTooltip: true, ...(orientation !== undefined ? { orientation } : {}), ...slider }}
  dataAttributes={{ ...dataAttributes, "data-purpose": "radius" }}
/>
