<script lang="ts">
  import { mergeClass } from "../../internal/merge-class.js";
  import type { TabPanelProps } from "./types.js";

  let {
    id,
    tabId,
    hidden = false,
    children,
    class: className,
  }: TabPanelProps = $props();

  const mergedClass = $derived(mergeClass("mw-tab-group__panel", className));
</script>

<div
  {id}
  role="tabpanel"
  aria-labelledby={tabId}
  class={mergedClass}
  hidden={hidden || undefined}
  tabindex={hidden ? undefined : 0}
>
  {@render children?.()}
</div>
