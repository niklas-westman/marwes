<script lang="ts">
  import { IconName, createDrawerRecipe } from "@marwes-ui/core";
  import type { DrawerOptions } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import Icon from "../icon/Icon.svelte";
  import type { DrawerProps } from "./types.js";

  let {
    id: userProvidedId,
    title,
    description,
    children,
    footer,
    onclose,
    class: className,
    panelClass,
    dataAttributes,
    size,
    placement,
    showFooter,
    dismissible,
    modal,
    showScrim,
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
  }: DrawerProps = $props();

  const uniqueId = $props.id();
  const drawerId = $derived(userProvidedId ?? `mw-drawer-${uniqueId}`);
  const titleId = $derived(`${drawerId}-title`);
  const descriptionId = $derived(`${drawerId}-description`);

  const hasTitle = $derived(title !== undefined && title.trim().length > 0);
  const hasDescription = $derived(description !== undefined && description.trim().length > 0);
  const hasFooter = $derived((showFooter ?? true) && footer !== undefined);
  const isDismissible = $derived((dismissible ?? true) && onclose !== undefined);

  const drawerOptions = $derived.by((): DrawerOptions => {
    const opts: DrawerOptions = {
      showFooter: hasFooter,
      dismissible: isDismissible,
    };
    if (modal !== undefined) opts.modal = modal;
    if (showScrim !== undefined) opts.showScrim = showScrim;
    if (dataAttributes !== undefined) opts.dataAttributes = dataAttributes;
    if (size !== undefined) opts.size = size;
    if (placement !== undefined) opts.placement = placement;
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

  const kit = $derived(createDrawerRecipe(drawerOptions));
  const mergedClass = $derived(mergeClass(kit.className, className));
  const mergedPanelClass = $derived(mergeClass(kit.panel.className, panelClass));

  function handleClose(): void {
    onclose?.();
  }
</script>

<div class={mergedClass} {...kit.dataAttributes}>
  {#if kit.showScrim}
    <div
      class={kit.scrim.className}
      aria-hidden="true"
      onclick={isDismissible ? handleClose : undefined}
      {...kit.scrim.dataAttributes}
    ></div>
  {/if}

  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <div
    id={drawerId}
    class={mergedPanelClass}
    role={kit.panel.a11y.role}
    aria-modal={kit.panel.a11y.ariaModal ? "true" : undefined}
    aria-label={kit.panel.a11y.ariaLabel}
    aria-labelledby={kit.panel.a11y.ariaLabelledBy}
    aria-describedby={kit.panel.a11y.ariaDescribedBy}
    tabindex={-1}
    {...kit.panel.dataAttributes}
  >
    {#if hasTitle || kit.showCloseButton}
      <div class="mw-drawer__header">
        {#if hasTitle}
          <div class="mw-drawer__heading-group">
            <h2 class="mw-drawer__title" id={titleId}>{title}</h2>
          </div>
        {:else}
          <span class="mw-drawer__spacer" aria-hidden="true"></span>
        {/if}

        {#if kit.showCloseButton && onclose}
          <button
            type="button"
            class="mw-drawer__close"
            aria-label="Close drawer"
            onclick={handleClose}
          >
            <Icon name={IconName.X} decorative />
          </button>
        {/if}
      </div>
      <div class="mw-drawer__header-divider" aria-hidden="true"></div>
    {/if}

    <div class="mw-drawer__content">
      {#if hasDescription}
        <p class="mw-drawer__description" id={descriptionId}>{description}</p>
      {/if}
      {@render children?.()}
    </div>

    {#if hasFooter}
      <div class="mw-drawer__footer-divider" aria-hidden="true"></div>
      <div class="mw-drawer__footer">
        {@render footer?.({ close: handleClose })}
      </div>
    {/if}
  </div>
</div>
