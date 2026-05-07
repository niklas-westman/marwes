<script lang="ts">
  import { mergeStyle } from "../../internal/css-vars.js";
  import Spinner from "./Spinner.svelte";
  import type { ButtonSpinnerProps } from "./types.js";

  let {
    inverted = false,
    variant = "classic",
    size = "xs",
    decorative = true,
    style,
    ...rest
  }: ButtonSpinnerProps = $props();

  const spinnerStyle = $derived(
    mergeStyle(
      `--mw-spinner-track-color: ${inverted ? "color-mix(in srgb, currentColor 80%, transparent)" : "color-mix(in srgb, currentColor 35%, transparent)"}; --mw-spinner-indicator-color: currentColor`,
      style
    )
  );
</script>

<Spinner
  {...rest}
  {variant}
  {size}
  {decorative}
  style={spinnerStyle}
/>
