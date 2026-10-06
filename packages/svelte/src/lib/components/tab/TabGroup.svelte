<script lang="ts">
  import {
    buildTabGroupA11yIds,
    createTabRecipe,
    moveTabSelection,
    resolveTabValue,
    toTabHtmlAttributes,
    resolveTabListA11y,
    resolveTabPanelA11y,
    toTabListHtmlAttributes,
    toTabPanelHtmlAttributes,
  } from "@marwes-ui/core";
  import type { TabGroupItemState } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import Text from "../text/Text.svelte";
  import type { TabGroupProps } from "./types.js";

  let {
    id: idProp,
    label,
    ariaLabel,
    tabs,
    activeTab: controlledActive,
    defaultActiveTab,
    onactivetabchange,
    dataAttributes,
    class: className,
  }: TabGroupProps = $props();

  const uniqueId = $props.id();
  const groupId = $derived(idProp ?? `mw-tab-group-${uniqueId}`);

  const itemStates: TabGroupItemState[] = $derived(
    tabs.map((t) => ({ value: t.value, ...(t.disabled ? { disabled: true } : {}) }))
  );

  const itemValues = $derived(tabs.map((t) => t.value));
  const hasLabel = $derived(!!label);

  const a11yIds = $derived(buildTabGroupA11yIds({ id: groupId, itemValues, hasLabel }));
  const labelId = $derived(a11yIds.labelId ?? `${groupId}-label`);

  let internalActive = $state<string | undefined>(undefined);

  // The default is resolved during render (not in an effect) so server-rendered markup already
  // carries the initial selection.
  const activeValue = $derived(
    resolveTabValue(itemStates, controlledActive !== undefined ? controlledActive : (internalActive ?? defaultActiveTab))
  );

  function selectTab(value: string): void {
    if (controlledActive === undefined) {
      internalActive = value;
    }
    onactivetabchange?.(value);
  }

  function handleKeydown(e: KeyboardEvent): void {
    let direction: "next" | "previous" | "start" | "end" | undefined;
    if (e.key === "ArrowRight") direction = "next";
    else if (e.key === "ArrowLeft") direction = "previous";
    else if (e.key === "Home") direction = "start";
    else if (e.key === "End") direction = "end";

    if (!direction) return;
    e.preventDefault();

    const next = moveTabSelection(itemStates, activeValue, direction);
    if (next) {
      selectTab(next);
      const tabEl = document.getElementById(a11yIds.tabIds[next] ?? "");
      if (tabEl instanceof HTMLButtonElement) tabEl.focus();
    }
  }

  const mergedClass = $derived(mergeClass("mw-tab-group", className));
</script>

<div class={mergedClass} {...dataAttributes}>
  {#if label}
    <div class="mw-tab-group__header">
      <Text variant="label" id={labelId}>{label}</Text>
    </div>
  {/if}

  <div
    class="mw-tab-group__list"
    {...toTabListHtmlAttributes(
      resolveTabListA11y({ tabListId: a11yIds.tabListId, labelId: label ? labelId : undefined, ariaLabel })
    )}
    tabindex={-1}
    onkeydown={handleKeydown}
  >
    {#each tabs as tab}
      {@const isSelected = tab.value === activeValue}
      {@const kit = createTabRecipe({ selected: isSelected, ...(tab.disabled ? { disabled: tab.disabled } : {}), ...(tab.ariaLabel ? { ariaLabel: tab.ariaLabel } : {}), ...(a11yIds.panelIds[tab.value] ? { ariaControls: a11yIds.panelIds[tab.value] } : {}) })}
      <button
        id={a11yIds.tabIds[tab.value]}
        type="button"
        class={kit.className}
        {...toTabHtmlAttributes(kit.a11y)}
        disabled={tab.disabled}
        onclick={() => !tab.disabled && selectTab(tab.value)}
      >
        {tab.label}
      </button>
    {/each}
  </div>

  {#each tabs as tab}
    {@const isActive = tab.value === activeValue}
    <div
      {...toTabPanelHtmlAttributes(
        resolveTabPanelA11y({ id: a11yIds.panelIds[tab.value], tabId: a11yIds.tabIds[tab.value], hidden: !isActive })
      )}
      class="mw-tab-group__panel"
    >
      {#if isActive}
        {#if typeof tab.panel === "string"}
          <p class="mw-p mw-p--md">{tab.panel}</p>
        {:else}
          {@render tab.panel()}
        {/if}
      {/if}
    </div>
  {/each}
</div>
