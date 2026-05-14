<script lang="ts">
  import { IconName, createDialogRecipe } from "@marwes-ui/core";
  import type { DialogOptions } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import Icon from "../icon/Icon.svelte";
  import type { DialogProps } from "./types.js";

  let {
    id: userProvidedId,
    title,
    description,
    children,
    footer,
    onclose,
    class: className,
    dataAttributes,
    size,
    showFooter,
    dismissible,
    modal,
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
  }: DialogProps = $props();

  const uniqueId = $props.id();
  const dialogId = $derived(userProvidedId ?? `mw-dialog-${uniqueId}`);
  const titleId = $derived(`${dialogId}-title`);
  const descriptionId = $derived(`${dialogId}-description`);

  const hasTitle = $derived(title !== undefined && title.trim().length > 0);
  const hasDescription = $derived(description !== undefined && description.trim().length > 0);
  const hasFooter = $derived((showFooter ?? true) && footer !== undefined);
  const isDismissible = $derived((dismissible ?? true) && onclose !== undefined);

  const dialogOptions = $derived.by((): DialogOptions => {
    const opts: DialogOptions = {
      showFooter: hasFooter,
      dismissible: isDismissible,
    };
    if (modal !== undefined) opts.modal = modal;
    if (dataAttributes !== undefined) opts.dataAttributes = dataAttributes;
    if (size !== undefined) opts.size = size;
    if (ariaLabel !== undefined) opts.ariaLabel = ariaLabel;
    if (ariaLabelledBy !== undefined) {
      opts.ariaLabelledBy = ariaLabelledBy;
    } else if (ariaLabel === undefined && hasTitle) {
      opts.ariaLabelledBy = titleId;
    }
    if (ariaDescribedBy !== undefined) {
      opts.ariaDescribedBy = ariaDescribedBy;
    } else if (hasDescription) {
      opts.ariaDescribedBy = descriptionId;
    }
    return opts;
  });

  const kit = $derived(createDialogRecipe(dialogOptions));
  const mergedClass = $derived(mergeClass(kit.className, className));

  function handleClose(): void {
    onclose?.();
  }
</script>

<section
  id={dialogId}
  class={mergedClass}
  role={kit.a11y.role}
  aria-modal={kit.a11y.ariaModal ? "true" : undefined}
  aria-label={kit.a11y.ariaLabel}
  aria-labelledby={kit.a11y.ariaLabelledBy}
  aria-describedby={kit.a11y.ariaDescribedBy}
  tabindex={-1}
  {...kit.dataAttributes}
>
  {#if hasTitle || kit.showCloseButton}
    <header class="mw-dialog__header">
      {#if hasTitle}
        <div class="mw-dialog__heading-group">
          <h2 class="mw-dialog__title" id={titleId}>{title}</h2>
        </div>
      {:else}
        <span class="mw-dialog__spacer" aria-hidden="true"></span>
      {/if}

      {#if kit.showCloseButton && onclose}
        <button
          type="button"
          class="mw-dialog__close"
          aria-label="Close dialog"
          onclick={handleClose}
        >
          <Icon name={IconName.X} decorative />
        </button>
      {/if}
    </header>
    <div class="mw-dialog__header-divider" aria-hidden="true"></div>
  {/if}

  <div class="mw-dialog__content">
    {#if hasDescription}
      <p class="mw-dialog__description" id={descriptionId}>{description}</p>
    {/if}
    {@render children?.()}
  </div>

  {#if hasFooter}
    <div class="mw-dialog__footer-divider" aria-hidden="true"></div>
    <footer class="mw-dialog__footer">
      {@render footer?.({ close: handleClose })}
    </footer>
  {/if}
</section>
