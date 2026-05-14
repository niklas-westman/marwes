<script lang="ts">
  import { createTabRecipe } from "@marwes-ui/core";
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
  role={kit.a11y.role}
  aria-selected={kit.a11y.ariaSelected}
  aria-disabled={kit.a11y.ariaDisabled}
  aria-label={kit.a11y.ariaLabel}
  aria-controls={kit.a11y.ariaControls}
  tabindex={kit.a11y.tabIndex}
  disabled={coreProps.disabled}
  {onclick}
>
  {@render children?.()}
</button>
