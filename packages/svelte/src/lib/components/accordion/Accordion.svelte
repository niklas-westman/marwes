<script lang="ts">
  import {
    createAccordionRecipe,
    toAccordionPanelHtmlAttributes,
    toAccordionTriggerHtmlAttributes,
  } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { AccordionProps } from "./types.js";

  let {
    id: idProp,
    open = false,
    disabled = false,
    title,
    children,
    class: className,
    ontoggle,
  }: AccordionProps = $props();

  const uniqueId = $props.id();
  const resolvedId = $derived(idProp ?? `mw-accordion-${uniqueId}`);

  const kit = $derived(createAccordionRecipe({
    id: resolvedId,
    ...(open ? { open } : {}),
    ...(disabled ? { disabled } : {}),
  }));
  const mergedClass = $derived(mergeClass(kit.className, className));

  function handleTriggerClick(): void {
    if (disabled) return;
    ontoggle?.();
  }
</script>

<div class={mergedClass}>
  <button
    type="button"
    class="mw-accordion__trigger"
    {...toAccordionTriggerHtmlAttributes(kit.trigger.a11y)}
    {disabled}
    onclick={handleTriggerClick}
  >
    <span class="mw-accordion__title">{title}</span>
    <span class="mw-accordion__icon" aria-hidden="true"></span>
  </button>
  <section
    {...toAccordionPanelHtmlAttributes(kit.panel.a11y)}
    class="mw-accordion__panel"
    hidden={!open}
  >
    <div class="mw-accordion__content">
      {@render children?.()}
    </div>
  </section>
</div>
