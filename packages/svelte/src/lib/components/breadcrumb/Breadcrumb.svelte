<script lang="ts">
  import { IconName, createBreadcrumbRecipe } from "@marwes-ui/core";
  import Icon from "../icon/Icon.svelte";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { BreadcrumbItem, BreadcrumbProps } from "./types.js";

  let {
    items,
    ariaLabel,
    showHome,
    homeHref,
    homeLabel,
    dataAttributes,
    onitemselect,
    onhomeclick,
    class: className,
  }: BreadcrumbProps = $props();

  const breadcrumbOptions = $derived.by(() => {
    const options = { items };
    if (ariaLabel !== undefined) Object.assign(options, { ariaLabel });
    if (showHome !== undefined) Object.assign(options, { showHome });
    if (homeHref !== undefined) Object.assign(options, { homeHref });
    if (homeLabel !== undefined) Object.assign(options, { homeLabel });
    if (dataAttributes !== undefined) Object.assign(options, { dataAttributes });
    return options;
  });
  const kit = $derived(createBreadcrumbRecipe(breadcrumbOptions));
  const mergedClass = $derived(mergeClass(kit.className, className));

  function sourceItem(item: (typeof kit.items)[number]): BreadcrumbItem {
    return (
      (item.kind === "item" ? item.item : undefined) ?? {
        label: item.label,
        ...(item.value ? { value: item.value } : {}),
        ...(item.href ? { href: item.href } : {}),
        current: item.current,
      }
    );
  }
</script>

<nav class={mergedClass} aria-label={kit.a11y.ariaLabel} {...kit.dataAttributes}>
  <ol class={kit.list.className} role={kit.list.a11y.role}>
    {#each kit.items as item, index (item.key)}
      <li class={item.className} {...item.dataAttributes}>
        {#if index > 0}
          <span class={kit.separator.className} aria-hidden={kit.separator.a11y.ariaHidden}>
            <Icon name={IconName.ChevronRight} decorative size={12} />
          </span>
        {/if}

        {#if item.kind === "home"}
          {#if item.href}
            <a
              class={item.actionClassName}
              href={item.href}
              aria-label={item.a11y.ariaLabel}
              aria-current={item.current ? "page" : undefined}
              onclick={() => onhomeclick?.()}
            >
              <Icon name={IconName.Home} decorative size={14} />
            </a>
          {:else if !item.current}
            <button
              type="button"
              class={item.actionClassName}
              aria-label={item.a11y.ariaLabel}
              aria-current={item.current ? "page" : undefined}
              onclick={() => onhomeclick?.()}
            >
              <Icon name={IconName.Home} decorative size={14} />
            </button>
          {:else}
            <span
              class={item.actionClassName}
              aria-label={item.a11y.ariaLabel}
              aria-current={item.current ? "page" : undefined}
            >
              <Icon name={IconName.Home} decorative size={14} />
            </span>
          {/if}
        {:else if item.current}
          <span
            class={item.actionClassName}
            aria-label={item.a11y.ariaLabel}
            aria-current={item.a11y.ariaCurrent}
          >
            {item.label}
          </span>
        {:else if item.href}
          <a
            class={item.actionClassName}
            href={item.href}
            aria-label={item.a11y.ariaLabel}
            aria-current={item.a11y.ariaCurrent}
            onclick={() => onitemselect?.(item.value ?? item.label, sourceItem(item))}
          >
            {item.label}
          </a>
        {:else}
          <button
            type="button"
            class={item.actionClassName}
            aria-label={item.a11y.ariaLabel}
            aria-current={item.a11y.ariaCurrent}
            onclick={() => onitemselect?.(item.value ?? item.label, sourceItem(item))}
          >
            {item.label}
          </button>
        {/if}
      </li>
    {/each}
  </ol>
</nav>
