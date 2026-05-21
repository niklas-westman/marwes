<script lang="ts">
  import {
    IconName,
    clampPaginationPage,
    createPaginationControlRecipe,
    createPaginationEllipsisRecipe,
    createPaginationListItemRecipe,
    createPaginationListRecipe,
    createPaginationPageRecipe,
    createPaginationRecipe,
  } from "@marwes-ui/core";
  import { onMount } from "svelte";
  import { mergeClass } from "../../internal/merge-class.js";
  import Icon from "../icon/Icon.svelte";
  import type { PaginationProps } from "./types.js";

  let {
    pageCount,
    page = $bindable(undefined),
    defaultPage,
    siblingCount,
    boundaryCount,
    maxVisibleItems,
    adaptive = true,
    showPrevNext,
    disabled,
    previousLabel = "Previous",
    nextLabel = "Next",
    ariaLabel,
    onpagechange,
    class: className,
    id,
  }: PaginationProps = $props();

  let internalPage = $state<number | undefined>(undefined);
  let rootElement = $state<HTMLElement | undefined>(undefined);
  let adaptiveMaxVisibleItems = $state<number | undefined>(undefined);

  const resolvedPage = $derived(
    clampPaginationPage(page !== undefined ? page : internalPage, pageCount)
  );

  $effect(() => {
    if (internalPage === undefined) {
      internalPage = clampPaginationPage(defaultPage, pageCount);
    }
  });

  function selectPage(nextPage: number): void {
    if (disabled) return;

    const resolved = clampPaginationPage(nextPage, pageCount);
    if (resolved === 0 || resolved === resolvedPage) return;

    if (page !== undefined) {
      page = resolved;
    } else {
      internalPage = resolved;
    }
    onpagechange?.(resolved);
  }

  function parsePxValue(value: string, fallback: number): number {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function measureMaxVisibleItems(): void {
    const parent = rootElement?.parentElement;
    if (!rootElement || !parent || adaptive === false || typeof window === "undefined") {
      adaptiveMaxVisibleItems = undefined;
      return;
    }

    const rootStyles = window.getComputedStyle(rootElement);
    const parentStyles = window.getComputedStyle(parent);
    const itemSize = parsePxValue(rootStyles.getPropertyValue("--mw-pagination-size"), 32);
    const itemGap = parsePxValue(rootStyles.getPropertyValue("--mw-pagination-gap"), 2);
    const sectionGap = parsePxValue(
      rootStyles.getPropertyValue("--mw-pagination-section-gap"),
      12
    );
    const parentWidth =
      parent.getBoundingClientRect().width -
      parsePxValue(parentStyles.paddingLeft, 0) -
      parsePxValue(parentStyles.paddingRight, 0);

    if (parentWidth <= 0) {
      adaptiveMaxVisibleItems = undefined;
      return;
    }

    const controls = Array.from(rootElement.querySelectorAll<HTMLElement>(".mw-pagination__control"));
    const controlWidth = controls.reduce(
      (total, control) => total + control.getBoundingClientRect().width,
      0
    );
    const controlGaps = controls.length > 0 ? sectionGap * controls.length : 0;
    const availableItemWidth = Math.max(0, parentWidth - controlWidth - controlGaps);
    adaptiveMaxVisibleItems = Math.max(
      1,
      Math.floor((availableItemWidth + itemGap) / (itemSize + itemGap))
    );
  }

  function requestMeasure(): void {
    if (typeof window === "undefined") return;
    window.requestAnimationFrame(measureMaxVisibleItems);
  }

  onMount(() => {
    requestMeasure();

    const parent = rootElement?.parentElement;
    const resizeObserver =
      typeof window !== "undefined" && window.ResizeObserver && rootElement && parent
        ? new window.ResizeObserver(requestMeasure)
        : undefined;

    if (rootElement) resizeObserver?.observe(rootElement);
    if (parent) resizeObserver?.observe(parent);
    window.addEventListener("resize", requestMeasure);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", requestMeasure);
    };
  });

  $effect(() => {
    adaptive;
    requestMeasure();
  });

  const rootKit = $derived(
    createPaginationRecipe({
      page: resolvedPage,
      pageCount,
      siblingCount,
      boundaryCount,
      maxVisibleItems: maxVisibleItems ?? adaptiveMaxVisibleItems,
      showPrevNext,
      disabled,
      ariaLabel,
      previousLabel,
      nextLabel,
    })
  );
  const listKit = $derived(createPaginationListRecipe());
  const listItemKit = $derived(createPaginationListItemRecipe());
  const previousDisabled = $derived(disabled || resolvedPage <= 1);
  const nextDisabled = $derived(disabled || resolvedPage <= 0 || resolvedPage >= pageCount);
  const previousKit = $derived(
    createPaginationControlRecipe({
      direction: "previous",
      disabled: previousDisabled,
      label: previousLabel,
    })
  );
  const nextKit = $derived(
    createPaginationControlRecipe({
      direction: "next",
      disabled: nextDisabled,
      label: nextLabel,
    })
  );
  const mergedClass = $derived(mergeClass(rootKit.className, className));
</script>

<nav
  {id}
  bind:this={rootElement}
  class={mergedClass}
  aria-label={rootKit.a11y.ariaLabel}
  data-component="pagination"
>
  {#if rootKit.showPrevNext}
    <button
      type="button"
      class={previousKit.className}
      aria-label={previousKit.a11y.ariaLabel}
      aria-disabled={previousKit.a11y.ariaDisabled}
      disabled={previousDisabled}
      onclick={() => selectPage(resolvedPage - 1)}
    >
      <span class="mw-pagination__control-icon">
        <Icon name={IconName.ChevronLeft} decorative size={12} />
      </span>
      {previousLabel}
    </button>
  {/if}

  <ul class={listKit.className} role={listKit.a11y.role}>
    {#each rootKit.items as item (item.key)}
      <li class={listItemKit.className}>
        {#if item.type === "ellipsis"}
          {@const ellipsisKit = createPaginationEllipsisRecipe()}
          <span class={ellipsisKit.className} aria-hidden={ellipsisKit.a11y.ariaHidden}>
            ...
          </span>
        {:else}
          {@const pageKit = createPaginationPageRecipe({
            page: item.page,
            selected: item.selected,
            disabled,
          })}
          <button
            type="button"
            class={pageKit.className}
            aria-label={pageKit.a11y.ariaLabel}
            aria-current={pageKit.a11y.ariaCurrent}
            aria-disabled={pageKit.a11y.ariaDisabled}
            disabled={disabled}
            onclick={() => selectPage(item.page)}
          >
            {item.page}
          </button>
        {/if}
      </li>
    {/each}
  </ul>

  {#if rootKit.showPrevNext}
    <button
      type="button"
      class={nextKit.className}
      aria-label={nextKit.a11y.ariaLabel}
      aria-disabled={nextKit.a11y.ariaDisabled}
      disabled={nextDisabled}
      onclick={() => selectPage(resolvedPage + 1)}
    >
      {nextLabel}
      <span class="mw-pagination__control-icon">
        <Icon name={IconName.ChevronRight} decorative size={12} />
      </span>
    </button>
  {/if}
</nav>
