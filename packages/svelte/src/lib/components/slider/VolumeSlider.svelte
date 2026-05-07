<script lang="ts">
  import SliderField from "./SliderField.svelte";
  import type { SliderProps } from "./types.js";

  interface VolumeSliderProps {
    id?: string;
    label?: string;
    helperText?: string;
    error?: string;
    slider?: Omit<SliderProps, "value">;
    value?: number;
    class?: string;
  }

  let { label = "Volume", slider, ...rest }: VolumeSliderProps = $props();
</script>
<div data-purpose="volume">
  <SliderField {...rest} {label} slider={{ min: 0, max: 100, step: 1, ...slider }} />
</div>
