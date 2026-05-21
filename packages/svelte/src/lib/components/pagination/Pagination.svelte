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
  import { mergeClass } from "../../internal/merge-class.js";
  import Icon from "../icon/Icon.svelte";
  import type { PaginationProps } from "./types.js";

  let {
    pageCount,
    page = $bindable(undefined),
    defaultPage,
    siblingCount,
    boundaryCount,
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

  const rootKit = $derived(
    createPaginationRecipe({
      page: resolvedPage,
      pageCount,
      siblingCount,
      boundaryCount,
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
