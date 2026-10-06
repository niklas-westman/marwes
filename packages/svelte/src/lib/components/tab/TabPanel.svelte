<script lang="ts">
  import { resolveTabPanelA11y, toTabPanelHtmlAttributes } from "@marwes-ui/core";
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

<div {...toTabPanelHtmlAttributes(resolveTabPanelA11y({ id, tabId, hidden }))} class={mergedClass}>
  {@render children?.()}
</div>
