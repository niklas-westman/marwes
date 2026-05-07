<script lang="ts">
  import { createDividerRecipe } from "@marwes-ui/core";
  import { cssVarsToStyle, mergeStyle } from "../../internal/css-vars.js";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { DividerProps } from "./types.js";

  let {
    class: className,
    style,
    ...options
  }: DividerProps = $props();

  const kit = $derived(createDividerRecipe(options));
  const mergedClass = $derived(mergeClass(kit.className, className));
  const mergedStyle = $derived(mergeStyle(cssVarsToStyle(kit.vars), style));
</script>

<hr
  class={mergedClass}
  style={mergedStyle}
  id={kit.a11y.id}
  role={kit.a11y.role}
  aria-orientation={kit.a11y["aria-orientation"]}
  data-component={kit.dataAttributes["data-component"]}
  data-orientation={kit.dataAttributes["data-orientation"]}
  data-size={kit.dataAttributes["data-size"]}
/>
