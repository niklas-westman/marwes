<script lang="ts">
  import SliderField from "./SliderField.svelte";
  import type { SliderFieldProps, SliderProps } from "./types.js";

  interface BrightnessSliderProps extends Omit<SliderFieldProps, "label" | "slider" | "minValueLabel" | "maxValueLabel"> {
    label?: string;
    slider?: Omit<SliderProps, "value">;
    orientation?: SliderProps["orientation"];
    minValueLabel?: string;
    maxValueLabel?: string;
  }

  let {
    label = "Brightness",
    slider,
    orientation,
    minValueLabel = "0",
    maxValueLabel = "100",
    dataAttributes,
    ...rest
  }: BrightnessSliderProps = $props();
</script>

<SliderField
  {...rest}
  {label}
  {minValueLabel}
  {maxValueLabel}
  slider={{ min: 0, max: 100, step: 1, showTooltip: true, ...(orientation !== undefined ? { orientation } : {}), ...slider }}
  dataAttributes={{ ...dataAttributes, "data-purpose": "brightness" }}
/>
