<script lang="ts">
  import SliderField from "./SliderField.svelte";
  import type { SliderProps } from "./types.js";

  interface BrightnessSliderProps {
    id?: string;
    label?: string;
    helperText?: string;
    error?: string;
    slider?: Omit<SliderProps, "value">;
    value?: number;
    class?: string;
  }

  let { label = "Brightness", slider, ...rest }: BrightnessSliderProps = $props();
</script>
<div data-purpose="brightness">
  <SliderField {...rest} {label} slider={{ min: 0, max: 100, step: 1, ...slider }} />
</div>
