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
    resolvePaginationAdaptiveProfile,
    resolvePaginationItemAriaLabel,
  } from "@marwes-ui/core";
  import { onMount } from "svelte";
  import { mergeClass } from "../../internal/merge-class.js";
  import Icon from "../icon/Icon.svelte";
  import type { PaginationAdaptiveProfile, PaginationResolvedControlDisplay } from "@marwes-ui/core";
  import type { PaginationProps } from "./types.js";

  let {
    pageCount,
    page = $bindable(undefined),
    defaultPage,
    siblingCount,
    boundaryCount,
    maxVisibleItems,
    controlDisplay = "auto",
    adaptive = true,
    showPrevNext,
    showFirstLast,
    disabled,
    firstLabel = "First",
    previousLabel = "Previous",
    nextLabel = "Next",
    lastLabel = "Last",
    ariaLabel,
    getItemAriaLabel,
    onpagechange,
    class: className,
    id,
  }: PaginationProps = $props();

  let internalPage = $state<number | undefined>(undefined);
  let rootElement = $state<HTMLElement | undefined>(undefined);
  let adaptiveProfile = $state<PaginationAdaptiveProfile | undefined>(undefined);
  let frame = 0;

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

  function resolveControlWidths(
    controls: HTMLElement[],
    itemSize: number
  ): { labelControlWidth: number; iconControlWidth: number } {
    const labelControlWidth = controls.reduce((total, control) => {
      const icon = control.querySelector<HTMLElement>(".mw-pagination__control-icon");
      const label = control.querySelector<HTMLElement>(".mw-pagination__control-label");
      const iconWidth = icon?.getBoundingClientRect().width ?? 0;
      const labelWidth = label?.scrollWidth ?? label?.getBoundingClientRect().width ?? 0;
      const labelGap = iconWidth > 0 && labelWidth > 0 ? 4 : 0;
      const measuredLabelWidth = iconWidth + labelGap + labelWidth;

      return total + Math.max(control.getBoundingClientRect().width, measuredLabelWidth);
    }, 0);

    return {
      labelControlWidth,
      iconControlWidth: controls.length * itemSize,
    };
  }

  function measureAdaptiveProfile(): void {
    const parent = rootElement?.parentElement;
    if (!rootElement || !parent || adaptive === false || typeof window === "undefined") {
      adaptiveProfile = undefined;
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
      adaptiveProfile = undefined;
      return;
    }

    const controls = Array.from(rootElement.querySelectorAll<HTMLElement>(".mw-pagination__control"));
    const { labelControlWidth, iconControlWidth } = resolveControlWidths(controls, itemSize);
    adaptiveProfile = resolvePaginationAdaptiveProfile({
      containerWidth: parentWidth,
      labelControlWidth,
      iconControlWidth,
      controlCount: controls.length,
      itemSize,
      itemGap,
      sectionGap,
      pageCount,
      ...(siblingCount !== undefined ? { siblingCount } : {}),
      ...(boundaryCount !== undefined ? { boundaryCount } : {}),
      ...(maxVisibleItems !== undefined ? { maxVisibleItems } : {}),
      controlDisplay,
    });
  }

  function requestMeasure(): void {
    if (typeof window === "undefined") return;
    window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(measureAdaptiveProfile);
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
      window.cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", requestMeasure);
    };
  });

  $effect(() => {
    adaptive;
    boundaryCount;
    controlDisplay;
    maxVisibleItems;
    pageCount;
    siblingCount;
    requestMeasure();
  });

  const resolvedControlDisplay = $derived<PaginationResolvedControlDisplay>(
    adaptive && adaptiveProfile
      ? adaptiveProfile.controlDisplay
      : controlDisplay === "icon"
        ? "icon"
        : "label"
  );
  const resolvedMaxVisibleItems = $derived(
    adaptive && adaptiveProfile ? adaptiveProfile.maxVisibleItems : maxVisibleItems
  );
  const rootKit = $derived(
    createPaginationRecipe({
      page: resolvedPage,
      pageCount,
      ...(siblingCount !== undefined ? { siblingCount } : {}),
      ...(boundaryCount !== undefined ? { boundaryCount } : {}),
      ...(resolvedMaxVisibleItems !== undefined ? { maxVisibleItems: resolvedMaxVisibleItems } : {}),
      controlDisplay: resolvedControlDisplay,
      ...(showPrevNext !== undefined ? { showPrevNext } : {}),
      ...(showFirstLast !== undefined ? { showFirstLast } : {}),
      ...(disabled !== undefined ? { disabled } : {}),
      ...(ariaLabel !== undefined ? { ariaLabel } : {}),
      firstLabel,
      previousLabel,
      nextLabel,
      lastLabel,
      ...(getItemAriaLabel !== undefined ? { getItemAriaLabel } : {}),
    })
  );
  const listKit = $derived(createPaginationListRecipe());
  const listItemKit = $derived(createPaginationListItemRecipe());
  const previousDisabled = $derived(disabled || resolvedPage <= 1);
  const nextDisabled = $derived(disabled || resolvedPage <= 0 || resolvedPage >= pageCount);
  const firstDisabled = $derived(disabled || resolvedPage <= 1);
  const lastDisabled = $derived(disabled || resolvedPage <= 0 || resolvedPage >= pageCount);
  const firstKit = $derived(
    createPaginationControlRecipe({
      direction: "first",
      disabled: firstDisabled,
      label: firstLabel,
      ...(getItemAriaLabel !== undefined
        ? {
            ariaLabel: resolvePaginationItemAriaLabel(getItemAriaLabel, {
              type: "first",
              page: 1,
              selected: false,
            }),
          }
        : {}),
    })
  );
  const previousKit = $derived(
    createPaginationControlRecipe({
      direction: "previous",
      disabled: previousDisabled,
      label: previousLabel,
      ...(getItemAriaLabel !== undefined
        ? {
            ariaLabel: resolvePaginationItemAriaLabel(getItemAriaLabel, {
              type: "previous",
              page: resolvedPage - 1,
              selected: false,
            }),
          }
        : {}),
    })
  );
  const nextKit = $derived(
    createPaginationControlRecipe({
      direction: "next",
      disabled: nextDisabled,
      label: nextLabel,
      ...(getItemAriaLabel !== undefined
        ? {
            ariaLabel: resolvePaginationItemAriaLabel(getItemAriaLabel, {
              type: "next",
              page: resolvedPage + 1,
              selected: false,
            }),
          }
        : {}),
    })
  );
  const lastKit = $derived(
    createPaginationControlRecipe({
      direction: "last",
      disabled: lastDisabled,
      label: lastLabel,
      ...(getItemAriaLabel !== undefined
        ? {
            ariaLabel: resolvePaginationItemAriaLabel(getItemAriaLabel, {
              type: "last",
              page: pageCount,
              selected: false,
            }),
          }
        : {}),
    })
  );
  const mergedClass = $derived(mergeClass(rootKit.className, className));
  const rootStyle = $derived(rootKit.vars["--mw-pagination-list-width"]
    ? `--mw-pagination-list-width: ${rootKit.vars["--mw-pagination-list-width"]};`
    : undefined);
</script>

<nav
  {id}
  bind:this={rootElement}
  class={mergedClass}
  style={rootStyle}
  aria-label={rootKit.a11y.ariaLabel}
  data-component="pagination"
  data-control-display={rootKit.controlDisplay}
>
  {#if rootKit.showFirstLast}
    <button
      type="button"
      class={firstKit.className}
      aria-label={firstKit.a11y.ariaLabel}
      aria-disabled={firstKit.a11y.ariaDisabled}
      disabled={firstDisabled}
      onclick={() => selectPage(1)}
    >
      <span class="mw-pagination__control-icon">
        <Icon name={IconName.ChevronsLeft} decorative size={12} />
      </span>
      <span class="mw-pagination__control-label">{firstLabel}</span>
    </button>
  {/if}

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
      <span class="mw-pagination__control-label">{previousLabel}</span>
    </button>
  {/if}

  <ul class={listKit.className} role={listKit.a11y.role}>
    {#each rootKit.items as item (item.key)}
      <li class={listItemKit.className}>
        {#if item.type !== "page"}
          {@const ellipsisKit = createPaginationEllipsisRecipe()}
          <span class={ellipsisKit.className} aria-hidden={ellipsisKit.a11y.ariaHidden}>
            ...
          </span>
        {:else}
          {@const pageKit = createPaginationPageRecipe({
            page: item.page,
            selected: item.selected,
            ...(disabled !== undefined ? { disabled } : {}),
            ...(getItemAriaLabel !== undefined
              ? {
                  ariaLabel: resolvePaginationItemAriaLabel(getItemAriaLabel, {
                    type: "page",
                    page: item.page,
                    selected: item.selected,
                  }),
                }
              : {}),
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
      <span class="mw-pagination__control-label">{nextLabel}</span>
      <span class="mw-pagination__control-icon">
        <Icon name={IconName.ChevronRight} decorative size={12} />
      </span>
    </button>
  {/if}

  {#if rootKit.showFirstLast}
    <button
      type="button"
      class={lastKit.className}
      aria-label={lastKit.a11y.ariaLabel}
      aria-disabled={lastKit.a11y.ariaDisabled}
      disabled={lastDisabled}
      onclick={() => selectPage(pageCount)}
    >
      <span class="mw-pagination__control-label">{lastLabel}</span>
      <span class="mw-pagination__control-icon">
        <Icon name={IconName.ChevronsRight} decorative size={12} />
      </span>
    </button>
  {/if}
</nav>
