<script lang="ts">
  import { IconName } from "@marwes-ui/core";
  import type { IconNameType } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import Icon from "../icon/Icon.svelte";
  import Tooltip from "./Tooltip.svelte";
  import type { TooltipGroupProps } from "./types.js";

  const TOOLTIP_EXIT_DURATION_MS = 160;

  let {
    content,
    icon = IconName.HelpCircle,
    triggerLabel = "Show tooltip",
    open,
    defaultOpen = false,
    onopenchange,
    tooltipId: tooltipIdProp,
    tooltipClass,
    triggerClass,
    dataAttributes,
    class: className,
    id: idProp,
  }: TooltipGroupProps = $props();

  const uniqueId = $props.id();
  const groupId = $derived(idProp ?? `mw-tooltip-group-${uniqueId}`);
  const resolvedTooltipId = $derived(tooltipIdProp ?? `${groupId}-tooltip`);

  const isControlled = $derived(open !== undefined);
  let internalOpen = $state(defaultOpen);
  const resolvedOpen = $derived(isControlled ? (open as boolean) : internalOpen);
  let isTooltipMounted = $state(resolvedOpen);

  $effect(() => {
    if (resolvedOpen) {
      isTooltipMounted = true;
    } else {
      const timer = setTimeout(() => {
        isTooltipMounted = false;
      }, TOOLTIP_EXIT_DURATION_MS);
      return () => clearTimeout(timer);
    }
  });

  function updateOpen(nextOpen: boolean): void {
    if (resolvedOpen === nextOpen) return;
    if (!isControlled) {
      internalOpen = nextOpen;
    }
    onopenchange?.(nextOpen);
  }

  const mergedClass = $derived(mergeClass("mw-tooltip-group", className));
  const mergedTriggerClass = $derived(mergeClass("mw-tooltip-group__trigger", triggerClass));
</script>

<span
  id={groupId}
  class={mergedClass}
  data-component="tooltip-group"
  data-open={resolvedOpen ? "true" : undefined}
  {...dataAttributes}
  onmouseenter={() => updateOpen(true)}
  onmouseleave={() => updateOpen(false)}
  onfocusin={() => updateOpen(true)}
  onfocusout={(e) => {
    const related = e.relatedTarget;
    if (related instanceof Node && e.currentTarget.contains(related)) return;
    updateOpen(false);
  }}
  onkeydown={(e) => { if (e.key === "Escape") updateOpen(false); }}
  role="presentation"
>
  {#if isTooltipMounted}
    <Tooltip
      id={resolvedTooltipId}
      {...(tooltipClass ? { class: tooltipClass } : {})}
      dataAttributes={{
        "data-state": resolvedOpen ? "open" : "closed",
        ...(resolvedOpen ? {} : { "aria-hidden": "true" }),
      }}
    >
      {#if typeof content === "string"}
        {content}
      {:else}
        {@render content()}
      {/if}
    </Tooltip>
  {/if}

  <button
    type="button"
    class={mergedTriggerClass}
    aria-label={triggerLabel}
    aria-describedby={resolvedOpen ? resolvedTooltipId : undefined}
  >
    <Icon name={icon} decorative />
  </button>
</span>
