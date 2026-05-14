<script lang="ts">
  import { createBadgeRecipe } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { BadgeProps } from "./types.js";

  let {
    children,
    class: className,
    id,
    dataAttributes,
    ...coreProps
  }: BadgeProps = $props();

  const kit = $derived(createBadgeRecipe(coreProps));
  const mergedClass = $derived(mergeClass(kit.className, className));
</script>

<span
  {id}
  class={mergedClass}
  aria-label={kit.a11y.ariaLabel}
  {...kit.dataAttributes}
  {...dataAttributes}
>
  {@render children?.()}
</span>
