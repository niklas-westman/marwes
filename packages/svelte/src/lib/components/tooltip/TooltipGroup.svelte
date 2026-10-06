<script lang="ts">
  import {
    IconName,
    resolveTooltipGroupA11y,
    toTooltipGroupContentHtmlAttributes,
    toTooltipTriggerHtmlAttributes,
  } from "@marwes-ui/core";
  import type { IconNameType } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import Icon from "../icon/Icon.svelte";
  import Tooltip from "./Tooltip.svelte";
  import type { TooltipGroupProps } from "./types.js";

  const TOOLTIP_EXIT_DURATION_MS = 160;

  let {
    content,
    icon = IconName.HelpCircle,
    triggerLabel,
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
  function getInitialOpen(): boolean {
    return defaultOpen;
  }

  function getInitialTooltipMounted(): boolean {
    return open ?? defaultOpen;
  }

  let internalOpen = $state(getInitialOpen());
  const resolvedOpen = $derived(isControlled ? (open as boolean) : internalOpen);
  let isTooltipMounted = $state(getInitialTooltipMounted());

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

  const groupA11y = $derived(
    resolveTooltipGroupA11y({ tooltipId: resolvedTooltipId, open: resolvedOpen, triggerLabel })
  );
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
        ...toTooltipGroupContentHtmlAttributes(groupA11y.content),
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
    {...toTooltipTriggerHtmlAttributes(groupA11y.trigger)}
  >
    <Icon name={icon} decorative />
  </button>
</span>
