<script lang="ts">
  import { createTabRecipe, toTabHtmlAttributes } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { TabProps } from "./types.js";

  let {
    children,
    class: className,
    id,
    onclick,
    ...coreProps
  }: TabProps = $props();

  const kit = $derived(createTabRecipe(coreProps));
  const mergedClass = $derived(mergeClass(kit.className, className));
</script>

<button
  {id}
  type="button"
  class={mergedClass}
  {...toTabHtmlAttributes(kit.a11y)}
  disabled={coreProps.disabled}
  {onclick}
>
  {@render children?.()}
</button>
