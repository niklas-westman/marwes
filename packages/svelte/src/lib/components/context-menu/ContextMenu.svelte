<script lang="ts">
  import { createContextMenuRecipe, toContextMenuItemHtmlAttributes, toContextMenuHtmlAttributes, toContextMenuDividerHtmlAttributes } from "@marwes-ui/core";
  import Icon from "../icon/Icon.svelte";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { ContextMenuProps } from "./types.js";

  let {
    items,
    ariaLabel,
    dataAttributes,
    onselect,
    class: className,
  }: ContextMenuProps = $props();

  const menuOptions = $derived.by(() => {
    const options = { items };
    if (ariaLabel !== undefined) Object.assign(options, { ariaLabel });
    if (dataAttributes !== undefined) Object.assign(options, { dataAttributes });
    return options;
  });
  const kit = $derived(createContextMenuRecipe(menuOptions));
  const mergedClass = $derived(mergeClass(kit.className, className));
</script>

<div class={mergedClass} {...toContextMenuHtmlAttributes(kit.a11y)} {...kit.dataAttributes}>
  {#each kit.items as item (item.key)}
    {#if item.kind === "divider"}
      <div
        class={item.className}
        {...toContextMenuDividerHtmlAttributes(item.a11y)}
        {...item.dataAttributes}
      ></div>
    {:else}
      <button
        {...toContextMenuItemHtmlAttributes(item.a11y)}
        class={item.className}
        onclick={() => {
          if (item.item.disabled) return;
          onselect?.(item.value, item.item);
        }}
        {...item.dataAttributes}
      >
        {#if item.icon}
          <span class="mw-context-menu__icon" aria-hidden="true">
            <Icon name={item.icon} decorative />
          </span>
        {/if}
        <span class="mw-context-menu__label">{item.label}</span>
      </button>
    {/if}
  {/each}
</div>
