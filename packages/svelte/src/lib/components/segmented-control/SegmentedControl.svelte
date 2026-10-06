<script lang="ts" generics="T extends string = string">
  import {
    createSegmentedControlRecipe,
    createSegmentedControlItemRecipe,
    moveSegmentedControlSelection,
    resolveSegmentedControlValue,
    toSegmentedControlHtmlAttributes,
    toSegmentedControlItemHtmlAttributes,
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
    ariaDescribedBy,
    fullWidth,
    label,
    class: className,
    id,
    style,
  }: SegmentedControlProps<T> = $props();

  const itemStates: SegmentedControlItemState[] = $derived(
    items.map((item) => ({ value: item.value, ...(item.disabled ? { disabled: true } : {}) }))
  );

  let internalValue = $state<string | undefined>(undefined);

  // The default is resolved during render (not in an effect) so server-rendered markup already
  // carries the initial selection.
  const resolvedValue = $derived(
    resolveSegmentedControlValue(
      itemStates,
      controlledValue !== undefined ? controlledValue : (internalValue ?? defaultValue)
    )
  );

  function selectItem(nextValue: string): void {
    const resolved = resolveSegmentedControlValue(itemStates, nextValue);
    if (!resolved || resolved === resolvedValue) return;

    if (controlledValue === undefined) {
      internalValue = resolved;
    }
    // `resolved` always traces back to one of `items[i].value: T`, so this cast is safe.
    onvaluechange?.(resolved as T);
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
    createSegmentedControlRecipe({ value: resolvedValue, variant, size, disabled, ariaLabel, ariaLabelledBy, ariaDescribedBy, fullWidth, label })
  );
  const mergedClass = $derived(mergeClass(trackKit.className, className));
</script>

<div
  {id}
  class={mergedClass}
  {...toSegmentedControlHtmlAttributes(trackKit.a11y)}
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
      {...toSegmentedControlItemHtmlAttributes(itemKit.a11y)}
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
