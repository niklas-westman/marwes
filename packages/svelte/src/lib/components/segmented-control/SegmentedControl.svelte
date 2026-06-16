<script lang="ts">
  import {
    createSegmentedControlRecipe,
    createSegmentedControlItemRecipe,
    moveSegmentedControlSelection,
    resolveSegmentedControlValue,
  } from "@marwes-ui/core";
  import type { SegmentedControlItemState } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { SegmentedControlProps } from "./types.js";

  let {
    items,
    value: controlledValue,
    defaultValue,
    onvaluechange,
    variant,
    size,
    disabled,
    ariaLabel,
    ariaLabelledBy,
    label,
    class: className,
    id,
    style,
  }: SegmentedControlProps = $props();

  const itemStates: SegmentedControlItemState[] = $derived(
    items.map((item) => ({ value: item.value, ...(item.disabled ? { disabled: true } : {}) }))
  );

  let internalValue = $state<string | undefined>(undefined);

  $effect(() => {
    if (internalValue === undefined) {
      internalValue = resolveSegmentedControlValue(itemStates, defaultValue);
    }
  });

  const resolvedValue = $derived(
    controlledValue !== undefined
      ? resolveSegmentedControlValue(itemStates, controlledValue)
      : internalValue
  );

  function selectItem(nextValue: string): void {
    const resolved = resolveSegmentedControlValue(itemStates, nextValue);
    if (!resolved || resolved === resolvedValue) return;

    if (controlledValue === undefined) {
      internalValue = resolved;
    }
    onvaluechange?.(resolved);
  }

  function handleKeydown(e: KeyboardEvent): void {
    let direction: "next" | "previous" | "start" | "end" | undefined;
    if (e.key === "ArrowRight") direction = "next";
    else if (e.key === "ArrowLeft") direction = "previous";
    else if (e.key === "Home") direction = "start";
    else if (e.key === "End") direction = "end";

    if (!direction) return;
    e.preventDefault();

    const next = moveSegmentedControlSelection(itemStates, resolvedValue, direction);
    if (next) {
      selectItem(next);
      const container = e.currentTarget as HTMLElement;
      const btn = container.querySelector<HTMLButtonElement>(`[data-value="${next}"]`);
      btn?.focus();
    }
  }

  const trackKit = $derived(
    createSegmentedControlRecipe({ value: resolvedValue, variant, size, disabled, ariaLabel, ariaLabelledBy, label })
  );
  const mergedClass = $derived(mergeClass(trackKit.className, className));
</script>

<div
  {id}
  class={mergedClass}
  role={trackKit.a11y.role}
  aria-label={trackKit.a11y.ariaLabel}
  aria-labelledby={trackKit.a11y.ariaLabelledBy}
  aria-disabled={trackKit.a11y.ariaDisabled}
  onkeydown={handleKeydown}
  style={style}
>
  {#each items as item}
    {@const isSelected = item.value === resolvedValue}
    {@const isItemDisabled = disabled || item.disabled}
    {@const itemKit = createSegmentedControlItemRecipe({
      value: item.value,
      selected: isSelected,
      disabled: isItemDisabled,
      ariaLabel: item.ariaLabel,
      iconOnly: item.icon != null && item.label == null,
    })}
    <button
      type="button"
      class={itemKit.className}
      role={itemKit.a11y.role}
      aria-checked={itemKit.a11y.ariaChecked}
      aria-disabled={itemKit.a11y.ariaDisabled}
      aria-label={itemKit.a11y.ariaLabel}
      tabindex={itemKit.a11y.tabIndex}
      disabled={isItemDisabled}
      data-value={item.value}
      onclick={() => !isItemDisabled && selectItem(item.value)}
    >
      {#if item.icon}
        {@render item.icon()}
      {/if}
      {#if item.label}
        {item.label}
      {/if}
    </button>
  {/each}
</div>
