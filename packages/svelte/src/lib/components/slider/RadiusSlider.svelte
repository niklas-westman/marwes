<script lang="ts">
  import SliderField from "./SliderField.svelte";
  import type { SliderProps } from "./types.js";

  interface RadiusSliderProps {
    id?: string;
    label?: string;
    helperText?: string;
    error?: string;
    slider?: Omit<SliderProps, "value">;
    value?: number;
    class?: string;
  }

  let { label = "Radius", slider, ...rest }: RadiusSliderProps = $props();
</script>
<div data-purpose="radius">
  <SliderField {...rest} {label} slider={{ min: 0, max: 48, step: 2, ...slider }} />
</div>
