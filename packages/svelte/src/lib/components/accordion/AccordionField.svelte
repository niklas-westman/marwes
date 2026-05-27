<script lang="ts">
  import { buildAccordionFieldA11yIds } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import Text from "../text/Text.svelte";
  import Accordion from "./Accordion.svelte";
  import type { AccordionFieldItem, AccordionFieldProps } from "./types.js";

  let {
    id: userProvidedId,
    label,
    description,
    error,
    items,
    openItems: controlledOpen,
    defaultOpenItems,
    onopenitemschange,
    multiple = true,
    ariaDescribedBy,
    disabled,
    class: className,
  }: AccordionFieldProps = $props();

  const uniqueId = $props.id();
  const fieldId = $derived(userProvidedId ?? `mw-accordion-field-${uniqueId}`);

  function hasTextContent(text: string | undefined): boolean {
    return text !== undefined && text.trim().length > 0;
  }

  const hasDescription = $derived(hasTextContent(description));
  const hasError = $derived(hasTextContent(error));

  const a11yIds = $derived(
    buildAccordionFieldA11yIds({ id: fieldId, hasDescription, hasError, externalDescribedBy: ariaDescribedBy })
  );

  let internalOpen = $state<string[]>(defaultOpenItems ?? []);
  const activeOpen = $derived(controlledOpen ?? internalOpen);

  function toggleItem(value: string): void {
    let next: string[];
    if (activeOpen.includes(value)) {
      next = activeOpen.filter((v) => v !== value);
    } else {
      next = multiple ? [...activeOpen, value] : [value];
    }
    if (controlledOpen === undefined) {
      internalOpen = next;
    }
    onopenitemschange?.(next);
  }

  const wrapperClass = $derived(
    mergeClass(
      "mw-accordion-field",
      disabled && "mw-accordion-field--disabled",
      hasError && "mw-accordion-field--invalid",
      className
    )
  );
</script>

<div
  class={wrapperClass}
  role="group"
  aria-labelledby={a11yIds.labelId}
  aria-describedby={a11yIds.describedBy}
  aria-invalid={hasError ? true : undefined}
>
  <div class="mw-accordion-field__label" id={a11yIds.labelId}>
    <Text variant="label">{label}</Text>
  </div>

  {#if hasDescription && !hasError}
    <div class="mw-accordion-field__description" id={a11yIds.descriptionId}>
      <Text variant="caption">{description}</Text>
    </div>
  {/if}

  <div class="mw-accordion-field__items">
    {#each items as item}
      <Accordion
        id={`${fieldId}-${item.value}`}
        title={item.title}
        open={activeOpen.includes(item.value)}
        disabled={disabled || item.disabled || false}
        ontoggle={() => toggleItem(item.value)}
      >
        {item.content}
      </Accordion>
    {/each}
  </div>

  {#if hasError}
    <div class="mw-accordion-field__error" id={a11yIds.errorId} aria-live="polite">
      <Text variant="caption">{error}</Text>
    </div>
  {/if}
</div>
